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

// --- Detail Actions ---


export async function getLeadDetails(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                car: {
                    include: {
                        make: true,
                        model: true,
                        images: true
                    }
                },
                assignedTo: true,
                activities: {
                    orderBy: { dueDate: 'desc' }
                },
                tags: true,
                financingRequest: true
            }
        })
        return { success: true, data: lead }
    } catch (error) {
        console.error("Error fetching lead details:", error)
        return { success: false, error: "Failed to fetch lead details" }
    }
}

export async function updateLeadDetails(leadId: string, data: any) {
    try {
        // Separate Financing Data specific key
        const { financing, ...leadData } = data

        // Filter valid Lead fields to avoid unknown arg error
        const leadValidKeys = ['firstName', 'lastName', 'email', 'phone', 'status', 'source', 'medium', 'campaign', 'message', 'priority']
        const leadUpdateData: any = {}
        for (const key of Object.keys(leadData)) {
            if (leadValidKeys.includes(key)) {
                leadUpdateData[key] = leadData[key]
            }
        }

        // 1. Update Lead Basic Info
        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: leadUpdateData
        })

        // 2. Upsert Financing Data if provided
        if (financing && lead.dealershipId && lead.carId) {
            // Extract scalar values from JSON for relational columns
            const financial = financing.financialData || {}
            const amount = Number(financial?.amountToFinance) || 0
            const term = Number(financial?.term) || 0
            const downPayment = Number(financial?.entry) || 0
            const monthlyFee = Number(financial?.monthlyFee) || undefined

            await prisma.financingRequest.upsert({
                where: { leadId: leadId },
                create: {
                    leadId: leadId,
                    dealershipId: lead.dealershipId,
                    carId: lead.carId,
                    amount,
                    term,
                    downPayment,
                    monthlyFee,
                    holderData: financing.holderData ?? {},
                    coHolderData: financing.coHolderData ?? {},
                    bankStatuses: financing.bankStatuses ?? {},
                    financialDetails: financing.financialData ?? {},
                    status: 'NEW'
                },
                update: {
                    amount,
                    term,
                    downPayment,
                    monthlyFee,
                    holderData: financing.holderData ?? undefined,
                    coHolderData: financing.coHolderData ?? undefined,
                    bankStatuses: financing.bankStatuses ?? undefined,
                    financialDetails: financing.financialData ?? undefined
                }
            })
        }

        revalidatePath('/admin/leads')
        return { success: true }
    } catch (error) {
        console.error("Error updating lead details:", error)
        return { success: false, error: "Failed to update lead details" }
    }
}
