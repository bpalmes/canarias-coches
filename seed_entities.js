
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding missing entities...');

    const entitiesToSeed = [
        { id: 8, name: 'Santander Consumer Finance', code: 'SANTANDER_CF' },
        { id: 11, name: 'BBVA Consumer Finance', code: 'BBVA_CF' },
        { id: 12, name: 'Abanca Servicios Financieros', code: 'ABANCA_SF' }, // Guessing Abanca based on typical market, or "Entidad 12"
        { id: 13, name: 'CaixaBank Payments & Consumer', code: 'CAIXABANK_PC' }
    ];

    // Refined names based on CSV extraction
    // 8: Santander - Config... -> Santander
    // 11: BBVA... -> BBVA
    // 12: Abanca... -> Abanca (Inferred, let's check CSV to be safe or use generic name)
    // 13: Caixa... -> CaixaBank

    // Let's look closer at the extraction output for 12: 
    // '12': 'Abanca - Configuración Base - octubre25'

    // Revised list:
    const entities = [
        { id: 8, name: 'Santander Consumer Finance', code: 'SANTANDER' },
        { id: 11, name: 'BBVA Consumer Finance', code: 'BBVA' },
        { id: 12, name: 'Abanca Servicios Financieros', code: 'ABANCA' },
        { id: 13, name: 'CaixaBank Payments & Consumer', code: 'CAIXABANK' }
    ];

    for (const e of entities) {
        const exists = await prisma.financialEntity.findUnique({ where: { id: e.id } });
        if (!exists) {
            await prisma.financialEntity.create({
                data: {
                    id: e.id, // Explicitly set ID
                    name: e.name,
                    code: e.code,
                    isActive: true
                }
            });
            console.log(`Created entity: ${e.name} (ID: ${e.id})`);
        } else {
            console.log(`Entity already exists: ${e.name} (ID: ${e.id})`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
