'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function distributeCarsForTesting() {
    console.log("[Testing] Distributing cars...")

    // 1. Ensure Test Dealerships Exist
    const dealerA = await prisma.dealership.upsert({
        where: { slug: 'test-dealer-a' },
        update: {},
        create: {
            name: "Test Dealer A",
            slug: "test-dealer-a",
            email: "testa@example.com",
            type: "MULTIBRAND",
            isActive: true
        }
    })

    const dealerB = await prisma.dealership.upsert({
        where: { slug: 'test-dealer-b' },
        update: {},
        create: {
            name: "Test Dealer B",
            slug: "test-dealer-b",
            email: "testb@example.com",
            type: "MULTIBRAND",
            isActive: true
        }
    })

    console.log(`[Testing] Dealerships ready: ${dealerA.id}, ${dealerB.id}`)

    // 2. Fetch ~20 random cars (or just first 20 that are available)
    // We'll reset their dealershipId to these test dealers
    const cars = await prisma.car.findMany({
        take: 20
    })

    if (cars.length < 2) {
        return { success: false, message: "Not enough cars in DB to distribute" }
    }

    // 3. Assign 10 to A, 10 to B (approx)
    // Just split current list
    const half = Math.floor(cars.length / 2)
    const carsForA = cars.slice(0, half)
    const carsForB = cars.slice(half)

    for (const car of carsForA) {
        await prisma.car.update({
            where: { id: car.id },
            data: { dealershipId: dealerA.id, isB2BAvailable: false, status: 'PUBLISHED' }
        })
    }

    for (const car of carsForB) {
        await prisma.car.update({
            where: { id: car.id },
            data: { dealershipId: dealerB.id, isB2BAvailable: false, status: 'PUBLISHED' }
        })
    }

    console.log(`[Testing] Distributed ${carsForA.length} cars to Dealer A and ${carsForB.length} to Dealer B`)

    revalidatePath('/admin')
    return { success: true, message: "Autos repartidos (PRIVADOS) entre Dealership A y Dealership B." }
}

export async function resetTestState() {
    console.log("[Testing] Resetting test state...")

    // 1. Find the main "demo-autos" dealership
    const demoDealer = await prisma.dealership.findUnique({
        where: { slug: 'demo-autos' }
    })

    if (!demoDealer) {
        return { success: false, message: "Demo dealer not found" }
    }

    // 2. Find Test Dealers
    const testDealers = await prisma.dealership.findMany({
        where: { slug: { in: ['test-dealer-a', 'test-dealer-b'] } }
    })

    const testDealerIds = testDealers.map(d => d.id)

    if (testDealerIds.length === 0) {
        return { success: true, message: "No active test dealers to clean." }
    }

    // 3. Delete ALL B2B Requests related to cars owned by test dealers (optional, but cleaner)
    // Actually, we should probably just clear ALL B2B Requests to be safe for "fresh flow"
    await prisma.b2BRequest.deleteMany({})

    // 4. Move cars back to demo-dealer and disable B2B
    const updateResult = await prisma.car.updateMany({
        where: { dealershipId: { in: testDealerIds } },
        data: {
            dealershipId: demoDealer.id,
            isB2BAvailable: false,
            b2bPrice: null
        }
    })

    console.log(`[Testing] Reset ${updateResult.count} cars back to Demo Autos.`)

    revalidatePath('/admin')
    return { success: true, message: `Estado reseteado. ${updateResult.count} coches devueltos a Demo Autos. Solicitudes B2B borradas.` }
}

export async function setImpersonation(dealershipId: string) {
    const cookieStore = await cookies()

    if (dealershipId === "CLEAR") {
        cookieStore.delete('impersonate_dealership')
    } else {
        cookieStore.set('impersonate_dealership', dealershipId)
    }

    revalidatePath('/')
    return { success: true }
}

export async function getAllDealerships() {
    return await prisma.dealership.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true }
    })
}

export async function deleteAllCars() {
    console.log("[Testing] Deleting ALL cars...")

    // 1. Delete all B2B requests first to avoid constraint errors
    await prisma.b2BRequest.deleteMany({})

    // 2. Delete all images (optional if cascade is set, but safe)
    await prisma.image.deleteMany({})

    // 3. Delete all cars
    const result = await prisma.car.deleteMany({})

    console.log(`[Testing] Deleted ${result.count} cars.`)

    revalidatePath('/admin')
    return { success: true, message: `Base de datos limpia. ${result.count} coches eliminados.` }
}
