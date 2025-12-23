
import { prisma } from './src/lib/prisma'

async function main() {
    const car = await prisma.car.findFirst({ where: { sku: '2924610' } });
    if (!car) { console.log('Car not found'); return; }
    console.log('Car:', { id: car.id, price: car.price, year: car.year, month: car.month });

    const now = new Date();
    const regDate = new Date(car.year, (car.month || 1) - 1, 1);
    const ageMonths = (now.getFullYear() - regDate.getFullYear()) * 12 + (now.getMonth() - regDate.getMonth());
    console.log('Age Months:', ageMonths, 'Code:', ageMonths <= 6 ? 'vn' : 'vo');

    const sofinco = await prisma.financialEntity.findFirst({ where: { name: { contains: 'Sofinco' } } });
    if (!sofinco) { console.log('Sofinco not found'); return; }

    const rules = await prisma.financialConfigurationDetail.findMany({
        where: {
            configuration: { entityId: sofinco.id, isActive: true },
            isActive: true,
            loanTerm: { durationMonths: 120 }
        },
        include: { interestRate: true, campaign: true }
    });

    console.log('Sofinco Rules (120m):');
    rules.forEach(r => console.log(`Type: ${r.calculationType}, Rate: ${r.interestRate?.value}, Campaign: ${r.campaign?.code}, Val: ${r.value}`));
}

main()
