import { DealershipService } from '../src/services/dealership-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const dealershipService = new DealershipService()

async function main() {
    console.log('🔍 Validating System Data...')

    // 1. Check Dealership
    const dealer = await dealershipService.getBySlug('demo-autos')
    if (dealer) {
        console.log(`✅ Dealership found: ${dealer.name}`)
    } else {
        console.error('❌ Dealership "demo-autos" NOT found!')
    }

    // 2. Check Makes
    const makeCount = await prisma.make.count()
    console.log(`ℹ️ Total Makes: ${makeCount}`)
    if (makeCount > 0) {
        const toyota = await prisma.make.findUnique({ where: { name: 'Toyota' }, include: { models: true } })
        if (toyota) {
            console.log(`✅ Toyota found with ${toyota.models.length} models`)
        } else {
            console.error('❌ Toyota make not found')
        }
    } else {
        console.error('❌ No makes found in DB')
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
