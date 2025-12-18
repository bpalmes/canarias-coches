import { PrismaClient, FinancingRequest, FinancingStatus } from '@prisma/client'

const prisma = new PrismaClient()

export class FinancingRequestService {

    async create(data: {
        dealershipId: number,
        leadId: string,
        carId: number,
        amount: number,
        term: number,
        downPayment: number,
        monthlyFee?: number
    }) {
        return prisma.financingRequest.create({
            data: {
                ...data,
                status: 'PENDING'
            }
        })
    }

    async getByDealership(dealershipId: number) {
        return prisma.financingRequest.findMany({
            where: { dealershipId },
            include: {
                lead: true,
                car: { include: { make: true, model: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    /**
     * Simulate sending to Genesis ERP via API
     */
    async sendToGenesis(requestId: string) {
        // TODO: Implement actual API call to Genesis
        console.log(`Sending request ${requestId} to Genesis...`)

        // Mock response
        const genesisId = `GEN-${Math.floor(Math.random() * 10000)}`

        return prisma.financingRequest.update({
            where: { id: requestId },
            data: {
                status: 'PROCESSING',
                genesisId: genesisId,
                genesisStatus: 'RECEIVED'
            }
        })
    }

    /**
     * Simulate sending email notification
     */
    async sendToEmail(requestId: string, email: string) {
        // TODO: Implement actual email sending (e.g. Resend, Nodemailer)
        console.log(`Sending request ${requestId} to email ${email}...`)

        return prisma.financingRequest.update({
            where: { id: requestId },
            data: {
                status: 'PROCESSING', // Or customized status
            }
        })
    }
}
