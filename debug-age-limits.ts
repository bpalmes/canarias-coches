
import { prisma } from './src/lib/prisma'

async function main() {
    const sofinco = await prisma.financialEntity.findFirst({ where: { name: { contains: 'Sofinco' } } });

    const rules = await prisma.financialConfigurationDetail.findMany({
        where: {
            configuration: { entityId: sofinco?.id, isActive: true },
            isActive: true,
            interestRate: { value: 6.99 } // Check the specific rate
        },
        include: { campaign: true }
    });

    console.log('Sofinco 6.99% Rules:');
    rules.forEach(r => console.log(`
    Type: ${r.calculationType}, 
    Campaign: ${r.campaign?.code}, 
    Val: ${r.value}, 
    MinAge: ${r.minVehiculoAgeMonths}, 
    MaxAge: ${r.maxVehiculoAgeMonths}
  `));
}

main()
