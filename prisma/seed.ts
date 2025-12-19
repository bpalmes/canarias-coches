import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create Default Dealership
  const demoDealer = await prisma.dealership.upsert({
    where: { slug: 'demo-autos' },
    update: {},
    create: {
      name: 'Demo Autos Canarias',
      slug: 'demo-autos',
      type: 'MULTIBRAND',
      email: 'contacto@demoautos.com',
      city: 'Las Palmas',
      isActive: true,
    },
  })
  console.log({ demoDealer })

  // 2. Create Users (Password: 1234)
  // Hash for '1234': $2a$10$abcdef... (Generating a real one or using a fix one if bcrypt is not available in seed, 
  // but better to import bcrypt if possible or use a known hash)
  // Known hash for '1234' cost 10: $2a$10$fb/.. is tricky. 
  // Let's use a simple pre-calculated hash for '1234' or import bcrypt.
  // We'll trust the dev env has bcryptjs installed.
  const passwordHash = '$2a$10$Z3.J. . . .  (wait, better to use real bcrypt in the script)'

  // Real implementation will use bcrypt
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('1234', 10);

  // A. Super Admin (ML)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ml.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@ml.com',
      name: 'Super Admin ML',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('👤 Created Super Admin: admin@ml.com')

  // B. Dealership Admin (Demo Autos)
  const dealerAdmin = await prisma.user.upsert({
    where: { email: 'gerente@demo-autos.com' },
    update: { password: hashedPassword, dealershipId: demoDealer.id },
    create: {
      email: 'gerente@demo-autos.com',
      name: 'Gerente Demo',
      password: hashedPassword,
      role: 'DEALERSHIP_ADMIN',
      dealershipId: demoDealer.id
    },
  })
  console.log('👤 Created Dealer Admin: gerente@demo-autos.com')

  // C. Second Dealership (Compraventa Sur)
  const surDealer = await prisma.dealership.upsert({
    where: { slug: 'compraventa-sur' },
    update: {},
    create: {
      name: 'Compraventa Sur',
      slug: 'compraventa-sur',
      type: 'MULTIBRAND',
      email: 'info@sur.com',
      city: 'Maspalomas',
      isActive: true,
    },
  })

  const surAdmin = await prisma.user.upsert({
    where: { email: 'admin@sur.com' },
    update: { password: hashedPassword, dealershipId: surDealer.id },
    create: {
      email: 'admin@sur.com',
      name: 'Admin Sur',
      password: hashedPassword,
      role: 'DEALERSHIP_ADMIN',
      dealershipId: surDealer.id
    },
  })
  console.log('👤 Created Dealer Admin: admin@sur.com')

  // 3. Seed Makes and Models
  const brands = [
    {
      name: 'Toyota',
      models: ['Corolla', 'Yaris', 'RAV4', 'C-HR', 'Hilux', 'Land Cruiser'],
    },
    {
      name: 'Volkswagen',
      models: ['Golf', 'Polo', 'Tiguan', 'T-Roc', 'Passat', 'Caddy'],
    },
    {
      name: 'Renault',
      models: ['Clio', 'Megane', 'Captur', 'Arkana', 'Kangoo'],
    },
    {
      name: 'Peugeot',
      models: ['208', '2008', '3008', '308', 'Rifter'],
    },
    {
      name: 'Dacia',
      models: ['Sandero', 'Duster', 'Jogger', 'Spring'],
    },
    {
      name: 'Hyundai',
      models: ['Tucson', 'Kona', 'i20', 'i30'],
    },
    {
      name: 'Kia',
      models: ['Sportage', 'Niro', 'Stonic', 'Picanto', 'Ceed'],
    },
  ]

  for (const brand of brands) {
    const make = await prisma.make.upsert({
      where: { name: brand.name },
      update: {},
      create: { name: brand.name },
    })

    for (const modelName of brand.models) {
      await prisma.model.upsert({
        where: {
          makeId_name: {
            makeId: make.id,
            name: modelName,
          },
        },
        update: {},
        create: {
          name: modelName,
          makeId: make.id,
        },
      })
    }
    console.log(`✅ Seeded ${brand.name} with ${brand.models.length} models`)
  }


  console.log('✅ Seeded dealership data.')

  // -----------------------------------------------------
  // 4. Seed Financial Calculator Data
  // -----------------------------------------------------

  // A. Financial Entities
  const financialEntities = [
    { name: 'Santander Consumer Finance', code: 'SANTANDER', logo: 'https://logo.clearbit.com/santanderconsumer.es' },
    { name: 'BBVA Consumer Finance', code: 'BBVA', logo: 'https://logo.clearbit.com/bbva.es' },
    { name: 'CaixaBank Consumer Finance', code: 'CAIXABANK', logo: 'https://logo.clearbit.com/caixabank.es' },
    { name: 'Cetelem BNP Paribas', code: 'CETELEM', logo: 'https://logo.clearbit.com/cetelem.es' },
    { name: 'Lendrock Finance', code: 'LENDROCK', logo: 'https://logo.clearbit.com/lendrock.com' },
    { name: 'Sofinco', code: 'SOFINCO', logo: 'https://logo.clearbit.com/sofinco.es' },
    { name: 'Confia Finance', code: 'CONFIA', logo: null },
  ]

  for (const entity of financialEntities) {
    await prisma.financialEntity.upsert({
      where: { id: financialEntities.indexOf(entity) + 1 }, // Assuming ID sequence matches order for seed consistency
      update: {},
      create: {
        name: entity.name,
        code: entity.code,
        logo: entity.logo,
        isActive: true,
      },
    })
  }
  console.log(`✅ Seeded ${financialEntities.length} Financial Entities`)

  // B. Interest Rates
  const interestRates = [
    { name: '4.99%', value: 4.99 },
    { name: '5.99%', value: 5.99 },
    { name: '6.99%', value: 6.99 },
    { name: '7.49%', value: 7.49 },
    { name: '7.99%', value: 7.99 },
    { name: '8.49%', value: 8.49 },
    { name: '8.99%', value: 8.99 },
    { name: '9.49%', value: 9.49 },
    { name: '9.99%', value: 9.99 },
    { name: '10.99%', value: 10.99 },
    { name: '11.99%', value: 11.99 },
  ]

  for (const rate of interestRates) {
    await prisma.financialInterestRate.upsert({
      where: { id: interestRates.indexOf(rate) + 1 },
      update: {},
      create: {
        name: rate.name,
        value: rate.value,
        isActive: true,
      },
    })
  }
  console.log(`✅ Seeded ${interestRates.length} Interest Rates`)

  // C. Loan Terms
  const loanTerms = [
    { name: '24 meses', months: 24 },
    { name: '36 meses', months: 36 },
    { name: '48 meses', months: 48 },
    { name: '60 meses', months: 60 },
    { name: '72 meses', months: 72 },
    { name: '84 meses', months: 84 },
    { name: '96 meses', months: 96 },
    { name: '108 meses', months: 108 },
    { name: '120 meses', months: 120 },
  ]

  for (const term of loanTerms) {
    await prisma.financialLoanTerm.upsert({
      where: { durationMonths: term.months },
      update: {},
      create: {
        name: term.name,
        durationMonths: term.months,
        isActive: true,
      },
    })
  }
  console.log(`✅ Seeded ${loanTerms.length} Loan Terms`)

  // D. Campaigns
  const campaigns = [
    { name: 'Vehículos Nuevos', code: 'vn', minAge: 0, maxAge: 12 },
    { name: 'Vehículos Ocasión', code: 'vo', minAge: 13, maxAge: null },
  ]

  for (const campaign of campaigns) {
    await prisma.financialCampaign.upsert({
      where: { code: campaign.code },
      update: {},
      create: {
        name: campaign.name,
        code: campaign.code,
        minVehiculoAgeMonths: campaign.minAge,
        maxVehiculoAgeMonths: campaign.maxAge,
        isActive: true,
      },
    })
  }
  console.log(`✅ Seeded ${campaigns.length} Campaigns`)

  console.log('✅ Seeding finished.')
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
