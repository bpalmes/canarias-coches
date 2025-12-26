'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { WalcuService } from "@/services/walcu-service"

// 1. Public Lead Creation (No Auth Required)
export async function createPublicLead(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    message?: string
    carId?: number
    source?: string
    medium?: string
    campaign?: string
}) {
    try {
        let dealershipId: number | null = null

        // Resolve Dealership from Car if present
        if (data.carId) {
            const car = await prisma.car.findUnique({
                where: { id: data.carId },
                select: { dealershipId: true }
            })
            if (car) dealershipId = car.dealershipId
        }

        // Create Lead
        const lead = await prisma.lead.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                message: data.message,
                source: data.source || 'website',
                medium: data.medium,
                campaign: data.campaign,
                status: 'NEW',
                // Relations
                ...(data.carId && { car: { connect: { id: data.carId } } }),
                // Dealership is required if car exists, or null if platform contact?
                // Lead schema: dealerships Dealership @relation(...)
                // dealershipId Int? 
                ...(dealershipId && { dealership: { connect: { id: dealershipId } } })
            }
        })

        // Revalidate Admin Leads
        revalidatePath('/admin/leads')

        return { success: true, leadId: lead.id }
    } catch (error) {
        console.error("Error creating public lead:", error)
        return { success: false, error: "Failed to create lead" }
    }
}

// 2. Manual Walcu Sync (Admin Only)
export async function sendLeadToWalcuAction(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { car: { include: { images: true } } }
        })

        if (!lead) return { success: false, error: "Lead not found" }

        const service = new WalcuService()
        let result

        if (lead.car) {
            // Map Car to Walcu Format based on InterestFormModal logic
            const walcuCar = {
                _id: lead.car.id.toString(),
                make: lead.car.makeId.toString(), // TODO: Ideally fetch Name, but Walcu might accept ID or string
                model: lead.car.modelId.toString(),
                year: lead.car.year,
                version: lead.car.version || '',
                license_plate: lead.car.numberplate || '',
                stock_number: lead.car.sku || '',
                price: lead.car.price,
                mileage: lead.car.kms,
                fuel: lead.car.fuel || '',
                transmission: lead.car.transmission || '',
                power: lead.car.power || 0,
                doors: lead.car.doors || 0,
                seats: lead.car.seats || 0,
                color: lead.car.color || '',
                vin: lead.car.vin || '',
                category: 'car' as const,
                type: 'used' as const,
                images: lead.car.images.map(img => img.url),
                ad_urls: [`/car/${lead.car.id}`]
            }

            result = await service.processCarInterestForm({
                firstName: lead.firstName,
                lastName: lead.lastName || '',
                email: lead.email,
                phone: lead.phone || undefined,
                message: lead.message || '',
                car: walcuCar,
                source: lead.source || 'manual_admin',
                medium: lead.medium || 'crm',
                campaign: lead.campaign || 'manual_sync'
            })
        } else {
            // General Contact
            result = await service.processContactForm({
                firstName: lead.firstName,
                lastName: lead.lastName || '',
                email: lead.email,
                phone: lead.phone || undefined,
                message: lead.message || '',
                source: lead.source || 'manual_admin',
                medium: lead.medium || 'crm',
                campaign: lead.campaign || 'manual_sync'
            })
        }

        if (result.success) {
            // Update Lead with Walcu ID
            await prisma.lead.update({
                where: { id: leadId },
                data: {
                    walcuStatus: 'sent',
                    walcuLeadId: result.lead?._id // WalcuLead usually has _id
                }
            })
            revalidatePath('/admin/leads')
            return { success: true }
        } else {
            await prisma.lead.update({
                where: { id: leadId },
                data: {
                    walcuStatus: 'failed',
                    walcuError: result.error
                }
            })
            return { success: false, error: result.error }
        }

    } catch (error) {
        console.error("Error sending to Walcu:", error)
        return { success: false, error: "Failed to sync" }
    }
}
