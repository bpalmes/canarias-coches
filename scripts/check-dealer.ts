
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for dealership "demo-autos"...');
    const d = await prisma.dealership.findUnique({
        where: { slug: 'demo-autos' }
    });

    if (d) {
        console.log('✅ FOUND:', d);
    } else {
        console.log('❌ NOT FOUND. Available dealerships:');
        const all = await prisma.dealership.findMany();
        console.log(all);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
