import { CarService } from '../src/services/car-service'
import { DealershipService } from '../src/services/dealership-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const carService = new CarService()
const dealershipService = new DealershipService()

async function main() {
    console.log('🚗 Starting Inventory Demo...')

    // 1. Get the Demo Dealership
    const dealer = await dealershipService.getBySlug('demo-autos')
    if (!dealer) throw new Error('Demo dealer not found. Run seed first.')
    console.log(`🏢 Acting as: ${dealer.name} (ID: ${dealer.id})`)

    // 2. Resolve Make/Model IDs (in a real app, this comes from UI selection)
    const toyota = await prisma.make.findUnique({ where: { name: 'Toyota' } })
    const corolla = await prisma.model.findFirst({ where: { makeId: toyota?.id, name: 'Corolla' } })

    if (!toyota || !corolla) throw new Error('Toyota Corolla not found in DB')

    // 3. Create a Car
    console.log('🆕 Creating a new car listing...')
    const newCar = await carService.create({
        dealershipId: dealer.id,
        makeId: toyota.id,
        modelId: corolla.id,
        title: 'Toyota Corolla Hybrid 2024',
        price: 24500,
        year: 2024,
        kms: 1500,
        description: 'Como nuevo, garantía oficial.',
    })
    console.log(`✅ Car Created! ID: ${newCar.id}, SKU: ${newCar.sku || 'N/A'}`)

    // 4. List Inventory
    console.log('📋 Fetching inventory...')
    const inventory = await carService.getByDealership(dealer.id)
    console.log(`Found ${inventory.meta.total} cars locally.`)

    inventory.data.forEach(car => {
        // @ts-ignore - types might be loose on relations unless typed strictly, but runtime should work
        console.log(` - [${car.id}] ${car.make.name} ${car.model.name} (${car.year}) - ${car.price}€`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
