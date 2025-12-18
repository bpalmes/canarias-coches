import { PrismaClient, Lead, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export class LeadService {

    async create(data: Prisma.LeadCreateInput) {
        return prisma.lead.create({
            data,
        })
    }

    async getByDealership(dealershipId: number, page = 1, limit = 50) {
        const skip = (page - 1) * limit
        return prisma.lead.findMany({
            where: { dealershipId },
            include: { car: { include: { make: true, model: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })
    }

    async updateStatus(id: string, status: any) { // Type should be LeadStatus but using any to avoid import issues for now
        return prisma.lead.update({
            where: { id },
            data: { status },
        })
    }
}
