'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

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

export async function calculateBulkInventoryFinancing(dealershipId: number) {
    const session = await getServerSession(authOptions)
    // Check permissions: either SuperAdmin or the Dealer himself
    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        throw new Error("Unauthorized")
    }
    // If dealer, must match
    if (session.user.dealershipId && session.user.dealershipId !== dealershipId) {
        throw new Error("Unauthorized (Wrong Dealership)")
    }

    // 1. Fetch dealership settings
    const dealership = await prisma.dealership.findUnique({
        where: { id: dealershipId },
        select: {
            financingEnabled: true,
            enableWithInsurance: true,
            enableWithoutInsurance: true,
            enabledFinancialEntities: { select: { id: true } },
            enabledInterestRates: { select: { id: true } }
        }
    })

    if (!dealership?.financingEnabled) {
        throw new Error("Financing not enabled for this dealership")
    }

    const enabledEntityIds = dealership.enabledFinancialEntities.map(e => e.id)
    const enabledRateIds = dealership.enabledInterestRates.map(r => r.id)

    // 2. Fetch all cars
    const cars = await prisma.car.findMany({
        where: { dealershipId, status: 'PUBLISHED' },
        select: { id: true, price: true, year: true, month: true }
    })

    let updatedCount = 0

    // 3. Iterate and Calculate
    for (const car of cars) {
        const regDate = new Date(car.year, (car.month || 1) - 1, 1) // Default to Jan

        try {
            // Find Min Installment With Insurance
            let bestOption = null
            if (dealership.enableWithInsurance) {
                bestOption = await findBestFinancingOption(car.price, regDate, true, enabledEntityIds, enabledRateIds)
            }

            // Find Min Installment Without Insurance
            let bestOptionSS = null
            if (dealership.enableWithoutInsurance) {
                bestOptionSS = await findBestFinancingOption(car.price, regDate, false, enabledEntityIds, enabledRateIds)
            }

            if (bestOption || bestOptionSS) {
                await prisma.car.update({
                    where: { id: car.id },
                    data: {
                        financeMinInstallment: bestOption?.monthlyPayment ?? null,
                        financeMinInstallmentSS: bestOptionSS?.monthlyPayment ?? null
                    }
                })
                updatedCount++
            }
        } catch (e) {
            console.error(`Failed to calc for car ${car.id}`, e)
        }
    }

    return { success: true, updatedCars: updatedCount }
}

async function findBestFinancingOption(price: number, regDate: Date, withInsurance: boolean, allowedEntityIds: number[], allowedRateIds: number[]) {
    const now = new Date()
    const ageMonths = (now.getFullYear() - regDate.getFullYear()) * 12 + (now.getMonth() - regDate.getMonth())
    const code = ageMonths <= 6 ? 'vn' : 'vo'

    // Fetch all details matching campaign & active
    // We want minimal monthly payment => simplified check:
    // If calculationType is 'coeficiente', payment = price * value / 100
    // We sort by 'value' (coefficient) ASC to find lowest payment? 
    // Yes, lower coefficient = lower payment for same price.

    const targetType = withInsurance ? 'coeficiente' : 'coeficiente_sin_seguro'

    // Build query
    const whereClause: any = {
        isActive: true,
        campaign: { code: code },
        configuration: { isActive: true, isLive: true },
        calculationType: targetType
    }

    if (allowedEntityIds.length > 0) {
        whereClause.configuration.entityId = { in: allowedEntityIds }
    }

    if (allowedRateIds.length > 0) {
        whereClause.interestRateId = { in: allowedRateIds } // Assuming relation exist or we filter details by rate
    }

    const detail = await prisma.financialConfigurationDetail.findFirst({
        where: whereClause,
        orderBy: {
            value: 'asc' // Smallest coefficient gives smallest payment
        }
    })

    if (!detail) return null

    const coef = Number(detail.value)
    const fee = (price * coef) / 100

    return { monthlyPayment: fee }
}
