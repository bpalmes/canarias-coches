'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { CarService } from "@/services/car-service"
import { revalidatePath } from "next/cache"
import { getActiveDealershipId } from "@/lib/auth-helpers"

const carService = new CarService()

export async function searchMyInventory(query: string) {
    const session = await getServerSession(authOptions)
    let dealershipId = await getActiveDealershipId(session)

    // Fallback for Super Admin: act as 'demo-autos' if not impersonating
    if (!dealershipId && session?.user?.role === 'SUPER_ADMIN') {
        const demo = await prisma.dealership.findUnique({ where: { slug: 'demo-autos' } })
        dealershipId = demo?.id
    }

    if (!dealershipId) {
        throw new Error("Unauthorized")
    }

    // Use CarService to find cars in my dealership
    const result = await carService.getAdminInventory({
        dealershipId,
        query,
        limit: 50,
        status: 'PUBLISHED' // Only published cars can be put on B2B market ideally? Or any. User said "de nuestra tabla de coches".
    })

    return result.data
}



export async function createB2BRequest(carId: number) {
    const session = await getServerSession(authOptions)
    let buyerId = await getActiveDealershipId(session)

    // Fallback for Super Admin
    if (!buyerId && session?.user?.role === 'SUPER_ADMIN') {
        const demo = await prisma.dealership.findUnique({ where: { slug: 'demo-autos' } })
        buyerId = demo?.id
    }

    if (!buyerId) {
        throw new Error("Unauthorized")
    }

    // Get car verification
    const car = await prisma.car.findUnique({
        where: { id: carId },
        include: { dealership: true }
    })

    if (!car || !car.isB2BAvailable) {
        throw new Error("Car not available for B2B")
    }

    if (car.dealershipId === buyerId) {
        throw new Error("You cannot buy your own car")
    }

    // Create request
    await prisma.b2BRequest.create({
        data: {
            carId,
            buyerId,
            sellerId: car.dealershipId,
            status: "PENDING"
        }
    })

    return { success: true }
}

export async function getB2BRequests() {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Unauthorized")

    // Super Admin logic: view all? Or view leads for platform?
    // User requested "Super Admin lo reserva... y le aparece en sus leads b2b".
    // If Super Admin acts as a broker, they might want to see ALL B2B requests.
    // Or if Super Admin IS the seller, they see their own.
    // Let's assume Super Admin sees ALL requests for management.

    // Check role, if Super Admin return all. If Dealer, return requests for their cars.
    const isSuperAdmin = !session.user.dealershipId
    const activeDealershipId = await getActiveDealershipId(session)

    // If I am a Super Admin AND I am NOT impersonating anyone -> View ALL
    // If I am impersonating -> View as that dealer
    // If I am a regular dealer -> View as myself

    const viewerId = activeDealershipId

    const whereClause = (isSuperAdmin && !viewerId)
        ? {}
        : {
            OR: [
                { sellerId: viewerId },
                { buyerId: viewerId }
            ]
        }

    const requests = await prisma.b2BRequest.findMany({
        where: whereClause,
        include: {
            car: {
                include: {
                    make: true,
                    model: true,
                    images: { take: 1 }
                }
            },
            buyer: true,
            seller: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return requests
}

export async function updateB2BRequestStatus(requestId: string, status: string) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Unauthorized")

    // Ideally verify permission (is Seller or Super Admin)

    await prisma.b2BRequest.update({
        where: { id: requestId },
        data: { status }
    })

    revalidatePath('/admin/b2b/market')
    return { success: true }
}

export async function getMyActiveB2BCars() {
    const session = await getServerSession(authOptions)
    let dealershipId = await getActiveDealershipId(session)

    // Fallback for Super Admin
    if (!dealershipId && session?.user?.role === 'SUPER_ADMIN') {
        const demo = await prisma.dealership.findUnique({ where: { slug: 'demo-autos' } })
        dealershipId = demo?.id
    }

    if (!dealershipId) {
        throw new Error("Unauthorized")
    }

    const result = await carService.getAdminInventory({
        dealershipId: dealershipId,
        isB2BAvailable: true,
        limit: 100
    })

    return result.data
}

export async function setCarB2B(carId: number, b2bPrice: number | null, isAvailable: boolean) {
    console.log(`[setCarB2B] Request received. CarId: ${carId}, Price: ${b2bPrice}, Available: ${isAvailable}`)

    const session = await getServerSession(authOptions)
    let dealershipId = await getActiveDealershipId(session)

    // Fallback for Super Admin
    if (!dealershipId && session?.user?.role === 'SUPER_ADMIN') {
        const demo = await prisma.dealership.findUnique({ where: { slug: 'demo-autos' } })
        dealershipId = demo?.id
    }

    if (!dealershipId) {
        console.error('[setCarB2B] Unauthorized: No session or dealershipId')
        throw new Error("Unauthorized")
    }

    // RESTRICTION: Only Super Admin can sell cars on B2B
    // If user is trying to ADD to B2B (isAvailable=true) or even modify, restrict it.
    if (session.user.role !== 'SUPER_ADMIN') {
        console.error('[setCarB2B] Forbidden: Only Super Admin can sell B2B')
        throw new Error("Solo el Super Admin puede poner coches en venta B2B")
    }

    console.log(`[setCarB2B] Authenticated DealershipId: ${dealershipId}`)

    // Verify ownership
    const car = await prisma.car.findFirst({
        where: {
            id: carId,
            dealershipId: dealershipId
        }
    })

    if (!car) {
        console.error(`[setCarB2B] Ownership Check Failed. Car ${carId} not found for Dealership ${dealershipId}`)
        throw new Error("Car not found or you don't have permission")
    }

    try {
        const updated = await prisma.car.update({
            where: { id: carId },
            data: {
                b2bPrice,
                isB2BAvailable: isAvailable
            }
        })
        console.log(`[setCarB2B] Success. Updated Car ${updated.id}: B2B=${updated.isB2BAvailable}, Price=${updated.b2bPrice}`)
    } catch (error) {
        console.error('[setCarB2B] Prisma Update Failed:', error)
        throw error
    }

    revalidatePath('/admin/b2b/market')
    return { success: true }
}

export async function getMarketCars(page = 1) {
    // Basic wrapper around service
    return carService.getB2BCars(page, 50)
}
