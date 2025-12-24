'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { calculateFinancialOptions, CalculatorResponse } from "@/actions/calculate-financial"

export async function getDealershipsForFinancing() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized")
    }

    const dealerships = await prisma.dealership.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
            financingEnabled: true,
            usePlatformFinancing: true,
            enableWithInsurance: true,
            enableWithoutInsurance: true,
            enabledFinancialEntities: { select: { id: true, name: true, code: true } },
            enabledInterestRates: { select: { id: true, name: true, value: true } }
        },
        orderBy: { name: 'asc' }
    })

    const allEntities = await prisma.financialEntity.findMany({
        where: { isActive: true },
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' }
    })

    const allInterestRatesRaw = await prisma.financialInterestRate.findMany({
        where: { isActive: true },
        select: { id: true, name: true, value: true },
        orderBy: { value: 'asc' }
    })

    // Serialize Decimal to number for Client Components
    const allInterestRates = allInterestRatesRaw.map(rate => ({
        ...rate,
        value: Number(rate.value)
    }))

    const serializedDealerships = dealerships.map(d => ({
        ...d,
        enabledInterestRates: d.enabledInterestRates.map(r => ({
            ...r,
            value: Number(r.value)
        }))
    }))

    return { dealerships: serializedDealerships, allEntities, allInterestRates }
}

export async function updateDealershipFinancing(id: number, data: {
    financingEnabled?: boolean,
    usePlatformFinancing?: boolean,
    enableWithInsurance?: boolean,
    enableWithoutInsurance?: boolean,
    enabledEntities?: number[], // List of IDs to connect
    enabledRates?: number[] // List of Interest Rate IDs
}) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized")
    }

    const { enabledEntities, enabledRates, ...simpleData } = data

    console.log("Updating dealership financing:", id, simpleData)

    // If enabledEntities provided, we replace the relation
    const updateData: any = { ...simpleData }

    if (enabledEntities !== undefined) {
        updateData.enabledFinancialEntities = {
            set: enabledEntities.map(eid => ({ id: eid }))
        }
    }

    if (enabledRates !== undefined) {
        updateData.enabledInterestRates = {
            set: enabledRates.map(rid => ({ id: rid }))
        }
    }

    await prisma.dealership.update({
        where: { id },
        data: updateData
    })

    revalidatePath('/admin/financing-management')
    return { success: true }
}

export async function updateCarFinancingMode(
    carId: number,
    usePlatformFinancing: boolean,
    manualQuota?: number
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.car.update({
        where: { id: carId },
        data: {
            usePlatformFinancing,
            monthlyFinancingFee: manualQuota
        }
    })

    revalidatePath('/admin/inventory')
    return { success: true }
}

export async function calculateBulkInventoryFinancing(dealershipId: number, useInsurance: boolean = true) {
    const session = await getServerSession(authOptions)
    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    if (session.user.dealershipId && session.user.dealershipId !== dealershipId) {
        throw new Error("Unauthorized (Wrong Dealership)")
    }

    const dealership = await prisma.dealership.findUnique({
        where: { id: dealershipId },
        include: {
            enabledFinancialEntities: true,
            enabledInterestRates: true
        }
    })

    if (!dealership || !dealership.financingEnabled) {
        throw new Error("Financing not enabled for this dealership")
    }

    if (useInsurance && !dealership.enableWithInsurance) {
        throw new Error("Financing with insurance not enabled for this dealership")
    }
    if (!useInsurance && !dealership.enableWithoutInsurance) {
        throw new Error("Financing without insurance not enabled for this dealership")
    }

    const cars = await prisma.car.findMany({
        where: {
            dealershipId,
            status: 'PUBLISHED',
            usePlatformFinancing: true
        },
        select: { id: true, price: true, year: true, month: true, dealershipId: true }
    })

    let updatedCount = 0

    // Pre-calculate common data
    const rateValues = dealership.enabledInterestRates.map(r => Number(r.value))
    const enabledEntityIds = new Set(dealership.enabledFinancialEntities.map(e => e.id))

    for (const car of cars) {
        try {
            const result = await processFinancingForCar(car, rateValues, enabledEntityIds, useInsurance)
            if (result.success) updatedCount++
        } catch (e) {
            console.error(`Error calculating for car ${car.id}:`, e)
        }
    }

    revalidatePath('/admin/inventory')
    return { success: true, updatedCars: updatedCount }
}

export async function calculateSingleCarFinancing(carId: number, useInsurance: boolean) {
    const session = await getServerSession(authOptions)
    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }

    const car = await prisma.car.findUnique({
        where: { id: carId },
        select: { id: true, price: true, year: true, month: true, dealershipId: true }
    })

    if (!car) throw new Error("Car not found")

    if (session.user.dealershipId && session.user.dealershipId !== car.dealershipId) {
        throw new Error("Unauthorized")
    }

    const dealership = await prisma.dealership.findUnique({
        where: { id: car.dealershipId },
        include: { enabledInterestRates: true, enabledFinancialEntities: true }
    })

    if (!dealership) throw new Error("Dealership not found")

    const rateValues = dealership.enabledInterestRates.map(r => Number(r.value))
    const enabledEntityIds = new Set(dealership.enabledFinancialEntities.map(e => e.id))

    return await processFinancingForCar(car, rateValues, enabledEntityIds, useInsurance)
}

// Helper function to centralize logic and persistence
async function processFinancingForCar(
    car: { id: number, price: number, year: number, month: number | null },
    rateValues: number[],
    enabledEntityIds: Set<number>,
    useInsurance: boolean
) {
    const regDate = new Date(car.year, (car.month || 1) - 1, 1)
    const loanTerm = 120

    const validOptions: any[] = []

    for (const rateVal of rateValues) {
        try {
            const res = await calculateFinancialOptions({
                registrationDate: regDate,
                loanAmount: car.price,
                wholePrice: car.price,
                loanRate: rateVal,
                loanTerm: loanTerm,
                sinSeguro: !useInsurance
            })

            if (res.success && res.data && res.data.financiado.length > 0) {
                for (const item of res.data.financiado) {
                    // 1. Filter by Enabled Entity
                    if (item.entityId && !enabledEntityIds.has(item.entityId)) continue

                    // 2. Get Value & Code
                    let val = 0
                    let refCode = ''

                    if (useInsurance) {
                        val = item.payment_amount ?? parseFloat(item.coef_fee?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                        refCode = item.coef_ref || ''
                    } else {
                        val = item.payment_amount_ss ?? parseFloat(item.coef_fee_ss?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                        refCode = item.coef_ref_ss || ''
                    }

                    // Parse numeric value from Code (e.g. C001500 -> 1500)
                    let refValue = 0
                    if (refCode.startsWith('C')) {
                        refValue = parseInt(refCode.substring(1)) || 0
                    }

                    if (val > 0) {
                        validOptions.push({
                            carId: car.id,
                            bankName: item.bank_name,
                            entityId: item.entityId,
                            monthlyFee: val,
                            interestRate: rateVal,
                            loanTerm: loanTerm,
                            isSinSeguro: !useInsurance,
                            financialCode: refCode,
                            financialRefValue: refValue
                            // Rank and Selected will be set after sorting
                        })
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (validOptions.length > 0) {
        // Sort by Monthly Fee ASC (Lowest first)
        validOptions.sort((a, b) => a.monthlyFee - b.monthlyFee)

        // Assign Rank and Selected
        const optionsToSave = validOptions.map((opt, index) => ({
            ...opt,
            rank: index + 1,
            isSelected: index === 0 // Default: Best option is selected
        }))

        // Transaction: Clear Old -> Save New -> Update Car
        await prisma.$transaction(async (tx) => {
            // Delete existing options for this mode (S/NS)
            await tx.carFinancingOption.deleteMany({
                where: { carId: car.id, isSinSeguro: !useInsurance }
            })

            // Create new options
            await tx.carFinancingOption.createMany({
                data: optionsToSave
            })

            // Update Car Min Installment (Cache)
            const best = optionsToSave[0]
            await tx.car.update({
                where: { id: car.id },
                data: {
                    ...(useInsurance ? { financeMinInstallment: best.monthlyFee } : { financeMinInstallmentSS: best.monthlyFee }),
                }
            })
        })

        const best = optionsToSave[0]
        revalidatePath('/admin/inventory/financing')
        return { success: true, value: best.monthlyFee, debug: `(${best.interestRate}%) ${best.bankName}` }
    } else {
        // If no options, clear existing? Or leave stale? 
        // Better to clear to reflect reality.
        await prisma.$transaction(async (tx) => {
            await tx.carFinancingOption.deleteMany({
                where: { carId: car.id, isSinSeguro: !useInsurance }
            })
            await tx.car.update({
                where: { id: car.id },
                data: {
                    ...(useInsurance ? { financeMinInstallment: null } : { financeMinInstallmentSS: null }),
                }
            })
        })

        return { success: false, error: "No matching financial options found." }
    }
}

// ----------------------------------------------------------------------
// New Actions for Manual Selection & Persistence
// ----------------------------------------------------------------------

export async function getFinancingOptionsForCar(carId: number, isSinSeguro: boolean) {
    const session = await getServerSession(authOptions)
    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }

    // Auth Check
    const car = await prisma.car.findUnique({ where: { id: carId }, select: { dealershipId: true } })
    if (!car) throw new Error("Car not found")
    if (session.user.dealershipId && session.user.dealershipId !== car.dealershipId) throw new Error("Unauthorized")

    return await prisma.carFinancingOption.findMany({
        where: {
            carId,
            isSinSeguro
        },
        orderBy: { monthlyFee: 'asc' }
    })
}

export async function setSelectedFinancingOption(optionId: number) {
    const session = await getServerSession(authOptions)
    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }

    const option = await prisma.carFinancingOption.findUnique({
        where: { id: optionId },
        include: { car: true }
    })

    if (!option) throw new Error("Option not found")

    if (session.user.dealershipId && session.user.dealershipId !== option.car.dealershipId) {
        throw new Error("Unauthorized")
    }

    await prisma.$transaction(async (tx) => {
        // 1. Unselect others
        await tx.carFinancingOption.updateMany({
            where: {
                carId: option.carId,
                isSinSeguro: option.isSinSeguro,
                id: { not: optionId }
            },
            data: { isSelected: false }
        })

        // 2. Select this one
        await tx.carFinancingOption.update({
            where: { id: optionId },
            data: { isSelected: true }
        })

        // 3. Update Car Cache
        await tx.car.update({
            where: { id: option.carId },
            data: {
                ...(option.isSinSeguro
                    ? { financeMinInstallmentSS: option.monthlyFee }
                    : { financeMinInstallment: option.monthlyFee })
            }
        })
    })

    revalidatePath('/admin/inventory')
    return { success: true }
}
