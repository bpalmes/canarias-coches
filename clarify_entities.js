
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Renaming duplicate entities for clarity...');

    // 1 (Original) -> Santander (Legacy)
    await prisma.financialEntity.update({
        where: { id: 1 },
        data: { name: 'Santander Consumer Finance (Legacy)' }
    });

    // 8 (CSV) -> Santander (CSV-8)
    const e8 = await prisma.financialEntity.findUnique({ where: { id: 8 } });
    if (e8) {
        await prisma.financialEntity.update({
            where: { id: 8 },
            data: { name: 'Santander Consumer Finance (CSV-8)' }
        });
    }

    // 12 (CSV/User Corrected) -> Santander (CSV-12)
    const e12 = await prisma.financialEntity.findUnique({ where: { id: 12 } });
    if (e12) {
        await prisma.financialEntity.update({
            where: { id: 12 },
            data: { name: 'Santander Consumer Finance (CSV-12)' }
        });
    }

    console.log('Renaming done.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
