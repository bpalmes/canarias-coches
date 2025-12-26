'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { FinancingStatus } from "@prisma/client"

export async function getFinancingKanbanReqs(dealershipId?: number) {
    // Strict Safety: If no dealershipId is provided (Unlinked Global Admin), return empty.
    // FinancingRequest requires a dealershipId, so we can't show "Unassigned".
    // Viewing "All" is disabled for safety based on user preference.
    if (!dealershipId) return { success: true, data: [] }

    try {
        const reqs = await prisma.financingRequest.findMany({
            where: {
                dealershipId: dealershipId
            },
            include: {
                lead: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                car: {
                    select: {
                        make: { select: { name: true } },
                        model: { select: { name: true } },
                        images: { take: 1, select: { url: true } },
                        price: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return { success: true, data: reqs }
    } catch (error) {
        console.error("Error fetching financing requests:", error)
        return { success: false, error: "Failed to fetch financing requests" }
    }
}

export async function updateFinancingStatus(id: string, status: FinancingStatus, subStatus?: string | null) {
    try {
        await prisma.financingRequest.update({
            where: { id },
            data: {
                status,
                subStatus: subStatus || null
            }
        })
        revalidatePath('/admin/financing')
        return { success: true }
    } catch (error) {
        console.error("Error updating financing status:", error)
        return { success: false, error: "Failed to update financing status" }
    }
}
