import { FinancingService } from '../src/services/financing-service'
import { DealershipService } from '../src/services/dealership-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const financingService = new FinancingService()
const dealershipService = new DealershipService()

async function main() {
    console.log('💰 Starting Financing Demo...')

    // 1. Get Dealer
    const dealer = await dealershipService.getBySlug('demo-autos')
    if (!dealer) throw new Error('Demo dealer not found')

    // 2. Create a Financing Campaign (if none exists)
    const existingConditions = await financingService.getConditions(dealer.id)
    let condition

    if (existingConditions.length === 0) {
        console.log('🆕 Creating Standard Financing Campaign...')
        condition = await financingService.createCondition({
            dealershipId: dealer.id,
            name: 'Standard Flex',
            interestRate: 6.99, // 6.99% TIN
            minTerm: 24,
            maxTerm: 84
        })
    } else {
        condition = existingConditions[0]
        console.log(`ℹ️ Using existing campaign: ${condition.name} (${condition.interestRate}%)`)
    }

    // 3. Simulate a Loan
    const carPrice = 24500
    const downPayment = 4500
    const term = 60 // 5 years

    console.log(`🧮 Simulating: Price ${carPrice}€, Entry ${downPayment}€, Term ${term} months`)

    const simulation = await financingService.simulate(carPrice, downPayment, term, condition.id)

    console.log('--- Result ---')
    console.log(`Monthly Fee: ${simulation.monthlyFee}€`)
    console.log(`Total Interest: ${simulation.totalInterests}€`)
    console.log(`Total Cost: ${simulation.totalCost}€`)

    if (simulation.monthlyFee > 300) {
        console.log('⚠️ Note: Monthly fee is above 300€')
    }
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
