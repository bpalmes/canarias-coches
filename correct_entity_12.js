
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Correcting Entity 12...');

    // User says ID 12 is Santander. 
    // We already have ID 1 as Santander Consumer Finance.
    // We'll name ID 12 as "Santander Consumer Finance (Alternative)" or similar to distinguish,
    // or exactly the same if unique constraint allows (usually name is not unique, only ID and Code).

    // Checking schema for constraints...
    // code VARCHAR(50) NOT NULL (Uniqueness not strictly defined in my snippet, but usually is)

    await prisma.financialEntity.update({
        where: { id: 12 },
        data: {
            name: 'Santander Consumer Finance',
            code: 'SANTANDER_CF_12' // Ensure code is unique
        }
    });

    console.log('Updated Entity 12 to Santander Consumer Finance');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
