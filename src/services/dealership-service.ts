import { PrismaClient, Dealership } from '@prisma/client'

const prisma = new PrismaClient()

export class DealershipService {
    /**
     * Find a dealership by its unique slug.
     */
    async getBySlug(slug: string): Promise<Dealership | null> {
        return prisma.dealership.findUnique({
            where: { slug },
        })
    }

    /**
     * Get all active dealerships (admin only or public directory).
     */
    async getAllActive(): Promise<Dealership[]> {
        return prisma.dealership.findMany({
            where: { isActive: true },
        })
    }

    /**
     * Create a new dealership.
     */
    async create(data: {
        name: string
        slug: string
        type?: 'OFFICIAL' | 'MULTIBRAND' | 'PRIVATE'
        email?: string
        city?: string
    }): Promise<Dealership> {
        return prisma.dealership.create({
            data: {
                ...data,
                type: data.type || 'MULTIBRAND',
            }
        })
    }
}
