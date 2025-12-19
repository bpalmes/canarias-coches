
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Current Entities ---');
    const entities = await prisma.financialEntity.findMany({
        orderBy: { id: 'asc' },
        include: { _count: { select: { configurations: true } } }
    });

    for (const e of entities) {
        // Count details for this entity
        const configIds = await prisma.financialEntityConfiguration.findMany({
            where: { entityId: e.id },
            select: { id: true }
        });
        const ids = configIds.map(c => c.id);
        const detailCount = await prisma.financialConfigurationDetail.count({
            where: { configurationId: { in: ids } }
        });

        console.log(`ID: ${e.id} | Name: "${e.name}" | Code: "${e.code}" | Configs: ${e._count.configurations} | Details: ${detailCount}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
