import { PrismaClient, Car, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export class CarService {
    /**
     * Get cars from ALL dealerships (Marketplace view).
     */
    async getAll(filters?: { makeId?: number, modelId?: number }, page = 1, limit = 20) {
        const skip = (page - 1) * limit
        const where: Prisma.CarWhereInput = {
            status: 'PUBLISHED' // Only active cars
        }

        if (filters?.makeId) where.makeId = filters.makeId
        if (filters?.modelId) where.modelId = filters.modelId

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                include: {
                    make: true,
                    model: true,
                    dealership: true, // Include dealer info
                    images: { orderBy: { order: 'asc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.car.count({ where })
        ])

        return {
            data: cars,
            meta: { total, page, lastPage: Math.ceil(total / limit) }
        }
    }

    /**
     * Get cars for a specific dealership.
     */
    async getByDealership(dealershipId: number, page = 1, limit = 20) {
        const skip = (page - 1) * limit

        // Fetch cars with relations
        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where: { dealershipId },
                include: {
                    make: true,
                    model: true,
                    images: {
                        orderBy: { order: 'asc' },
                        take: 1
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.car.count({ where: { dealershipId } })
        ])

        return {
            data: cars,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            }
        }
    }

    /**
     * Create a new car in the inventory.
     * Handles Make/Model connection naturally via IDs.
     */
    async create(data: {
        dealershipId: number
        makeId: number
        modelId: number
        price: number
        year: number
        kms: number
        title: string // We construct the name from this or automatically
        description?: string
    }): Promise<Car> {

        // We can auto-generate the 'name' from Make/Model if not provided, 
        // but here we might accept a string or build it.
        // For now, let's look up the make/model names to build a display name if needed,
        // or just rely on the relations for display.

        // Simple creation:
        return prisma.car.create({
            data: {
                dealershipId: data.dealershipId,
                makeId: data.makeId,
                modelId: data.modelId,
                price: data.price,
                year: data.year,
                kms: data.kms,
                name: data.title, // 'name' in schema
                description: data.description,
                status: 'DRAFT',
            }
        })
    }

    /**
     * Get a single car by ID, ensuring it belongs to the dealership (security).
     */
    /**
     * Get a single car by ID, ensuring it belongs to the dealership (security).
     */
    async getById(carId: number, dealershipId?: number) {
        const where: Prisma.CarWhereInput = { id: carId }
        if (dealershipId) {
            where.dealershipId = dealershipId
        }

        return prisma.car.findFirst({
            where,
            include: {
                make: true,
                model: true,
                images: true,
                dealership: true,
            }
        })
    }

    /**
     * Get cars available for B2B (Marketplace for Dealers).
     */
    async getB2BCars(page = 1, limit = 20) {
        // ... previous implementation ...
        const skip = (page - 1) * limit
        const where: Prisma.CarWhereInput = {
            isB2BAvailable: true,
            status: 'PUBLISHED'
        }

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                include: {
                    make: true,
                    model: true,
                    dealership: true,
                    images: { orderBy: { order: 'asc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.car.count({ where })
        ])

        return {
            data: cars,
            meta: { total, page, lastPage: Math.ceil(total / limit) }
        }
    }

    /**
     * Admin Inventory Listing with full filters
     */
    async getAdminInventory(params: {
        dealershipId?: number,
        status?: string,
        query?: string,
        page?: number,
        limit?: number,
        isB2BAvailable?: boolean
    }) {
        const page = params.page || 1
        const limit = params.limit || 20
        const skip = (page - 1) * limit

        const where: Prisma.CarWhereInput = {}

        if (params.dealershipId) {
            where.dealershipId = params.dealershipId
        }

        if (params.isB2BAvailable !== undefined) {
            where.isB2BAvailable = params.isB2BAvailable
        }

        if (params.status) {
            // @ts-ignore
            where.status = params.status
        }

        if (params.query) {
            const q = params.query
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
                { make: { name: { contains: q, mode: 'insensitive' } } },
                { model: { name: { contains: q, mode: 'insensitive' } } },
            ]
        }

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                include: {
                    make: true,
                    model: true,
                    dealership: true,
                    images: { orderBy: { order: 'asc' }, take: 1 },
                    // Include selected financing options to display rank/color
                    financingOptions: { where: { isSelected: true } }
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.car.count({ where })
        ])

        return {
            data: cars,
            meta: { total, page, lastPage: Math.ceil(total / limit) }
        }
    }
}
