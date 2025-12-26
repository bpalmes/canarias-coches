'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { LeadStatus } from "@prisma/client"

// --- Fetch Actions ---

export async function getKanbanLeads(dealershipId?: number) {
    // If no dealershipId (Global Admin), fetch Platform leads (dealershipId: null)
    const whereClause = { dealershipId: dealershipId || null }

    try {
        const leads = await prisma.lead.findMany({
            where: whereClause,
            include: {
                car: {
                    select: {
                        id: true,
                        make: { select: { name: true } },
                        model: { select: { name: true } },
                        version: true,
                        price: true,
                        images: {
                            take: 1,
                            select: { url: true }
                        }
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                activities: {
                    where: { isDone: false },
                    orderBy: { dueDate: 'asc' },
                    take: 1 // Only need the most urgent next activity for the card
                },
                tags: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, data: leads }
    } catch (error) {
        console.error("Error fetching leads:", error)
        return { success: false, error: "Failed to fetch leads" }
    }
}

// --- Mutation Actions ---

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
    try {
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: newStatus }
        })
        revalidatePath('/admin/leads')
        return { success: true }
    } catch (error) {
        console.error("Error updating lead status:", error)
        return { success: false, error: "Failed to update status" }
    }
}

export async function updateLeadPriority(leadId: string, priority: number) {
    try {
        await prisma.lead.update({
            where: { id: leadId },
            data: { priority }
        })
        revalidatePath('/admin/leads')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update priority" }
    }
}

// --- Activity Actions ---

export async function createLeadActivity(data: {
    leadId: string,
    type: string,
    summary: string,
    dueDate?: Date
}) {
    try {
        await prisma.leadActivity.create({
            data: {
                leadId: data.leadId,
                type: data.type,
                summary: data.summary,
                dueDate: data.dueDate,
                isDone: false
            }
        })
        revalidatePath('/admin/leads')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to create activity" }
    }
}
