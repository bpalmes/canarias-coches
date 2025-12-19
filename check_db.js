
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Check ---');

    // Check Entities
    const entities = await prisma.financialEntity.findMany();
    console.log(`Financial Entities Found: ${entities.length}`);
    entities.forEach(e => console.log(`- ID: ${e.id}, Name: ${e.name}`));

    // Check Configuration Details
    const count = await prisma.financialConfigurationDetail.count();
    console.log(`\nTotal Configuration Details: ${count}`);

    // Check Campaign Types in Details
    const details = await prisma.financialConfigurationDetail.findMany({
        select: { campaign: { select: { code: true } } }
    });

    const campCounts = {};
    details.forEach(d => {
        const c = d.campaign.code;
        campCounts[c] = (campCounts[c] || 0) + 1;
    });
    console.log('\nDetails by Campaign:', campCounts);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
