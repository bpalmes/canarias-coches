'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Fetch full details (including JSON fields)
export async function getFinancingRequestDetails(id: string) {
    try {
        const req = await prisma.financingRequest.findUnique({
            where: { id },
            include: {
                lead: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                car: {
                    select: {
                        make: { select: { name: true } },
                        model: { select: { name: true } },
                        version: true,
                        price: true,
                        images: { take: 1, select: { url: true } },
                        numberplate: true,
                    }
                }
            }
        })

        if (!req) return { success: false, error: "Not found" }

        return { success: true, data: req }
    } catch (error) {
        console.error("Error fetching financing details:", error)
        return { success: false, error: "Failed to fetch details" }
    }
}

// Update JSON fields
export async function updateFinancingFullData(id: string, data: {
    holderData?: any
    coHolderData?: any
    vehicleSnapshot?: any
    financialDetails?: any
    bankStatuses?: any
    subStatus?: string
}) {
    try {
        await prisma.financingRequest.update({
            where: { id },
            data: {
                ...(data.holderData && { holderData: data.holderData }),
                ...(data.coHolderData && { coHolderData: data.coHolderData }),
                ...(data.vehicleSnapshot && { vehicleSnapshot: data.vehicleSnapshot }),
                ...(data.financialDetails && { financialDetails: data.financialDetails }),
                ...(data.bankStatuses && { bankStatuses: data.bankStatuses }),
                ...(data.subStatus !== undefined && { subStatus: data.subStatus })
            }
        })
        revalidatePath('/admin/financing')
        return { success: true }
    } catch (error) {
        console.error("Error updating financing data:", error)
        return { success: false, error: "Failed to update" }
    }
}
