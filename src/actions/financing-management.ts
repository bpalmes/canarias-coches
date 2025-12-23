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
        select: { id: true, price: true, year: true, month: true }
    })

    let updatedCount = 0

    // Optimize: Pre-map enabled rates values
    const rateValues = dealership.enabledInterestRates.map(r => Number(r.value))
    const enabledEntityIds = new Set(dealership.enabledFinancialEntities.map(e => e.id))

    for (const car of cars) {
        const regDate = new Date(car.year, (car.month || 1) - 1, 1)

        let minInstallment = Infinity
        let foundOption = false

        // We must find the best option across ALL enabled rates for this dealer.
        const loanTerm = 120

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
                        // Filter
                        if (item.entityId && !enabledEntityIds.has(item.entityId)) continue

                        let val = 0
                        if (useInsurance) {
                            val = item.payment_amount ?? parseFloat(item.coef_fee?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                        } else {
                            val = item.payment_amount_ss ?? parseFloat(item.coef_fee_ss?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                        }

                        if (val > 0 && val < minInstallment) {
                            minInstallment = val
                            foundOption = true
                        }
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        if (foundOption && minInstallment !== Infinity) {
            await prisma.car.update({
                where: { id: car.id },
                data: {
                    ...(useInsurance ? { financeMinInstallment: minInstallment } : { financeMinInstallmentSS: minInstallment }),
                }
            })
            updatedCount++
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

    // Check ownership
    if (session.user.dealershipId && session.user.dealershipId !== car.dealershipId) {
        throw new Error("Unauthorized")
    }

    // Fetch dealer rates
    const dealership = await prisma.dealership.findUnique({
        where: { id: car.dealershipId },
        include: { enabledInterestRates: true, enabledFinancialEntities: true }
    })

    if (!dealership) throw new Error("Dealership not found")

    const regDate = new Date(car.year, (car.month || 1) - 1, 1)
    const rateValues = dealership.enabledInterestRates.map(r => Number(r.value))
    const enabledEntityIds = new Set(dealership.enabledFinancialEntities.map(e => e.id))

    let minInstallment = Infinity
    let foundOption = false
    let minRateFound = 0
    let minBankFound = ""
    let debugLog: string[] = []

    const loanTerm = 120

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
                    const isEnabled = item.entityId ? enabledEntityIds.has(item.entityId) : false

                    // 2. Get Raw Value
                    let val = 0
                    if (useInsurance) {
                        // Prefer raw, fallback to parsing if raw missing
                        val = item.payment_amount ?? parseFloat(item.coef_fee?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                    } else {
                        val = item.payment_amount_ss ?? parseFloat(item.coef_fee_ss?.replace(' €', '').replace('.', '').replace(',', '.') || '0')
                    }

                    if (val > 0) {
                        debugLog.push(`[${item.bank_name}(${item.entityId}) @ ${rateVal}%: ${val.toFixed(2)}€ ${isEnabled ? 'OK' : 'DISABLED'}]`)
                    }

                    if (!isEnabled) continue

                    // 3. Compare with Minimum
                    if (val > 0 && val < minInstallment) {
                        minInstallment = val
                        foundOption = true
                        minRateFound = rateVal
                        minBankFound = item.bank_name
                    }
                }
            }
        } catch (e) {
            console.error(e)
            debugLog.push(`[Error: ${e}]`)
        }
    }

    if (foundOption && minInstallment !== Infinity) {
        await prisma.car.update({
            where: { id: car.id },
            data: {
                ...(useInsurance ? { financeMinInstallment: minInstallment } : { financeMinInstallmentSS: minInstallment }),
            }
        })

        revalidatePath('/admin/inventory/financing')

        // Return detailed debug info
        const logStr = debugLog.length > 0 ? debugLog.join(' ') : 'No options found'
        return { success: true, value: minInstallment, debug: `Winner: ${minBankFound} (${minRateFound}%). Log: ${logStr}` }
    } else {
        const logStr = debugLog.length > 0 ? debugLog.join(' ') : 'No options found'
        return { success: false, error: "No matching financial options found. Log: " + logStr }
    }
}
