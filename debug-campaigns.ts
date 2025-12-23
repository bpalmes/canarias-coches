
import { prisma } from './src/lib/prisma'

async function main() {
    // Select specific columns if possible, but prisma findMany returns Typed objects.
    // We'll map them manually for logging.
    const campaigns = await prisma.financialCampaign.findMany();

    // Try to see if there are age fields (dynamic access as I don't trust the types I see in head)
    console.log(campaigns.map(c => ({
        id: c.id,
        code: c.code,
        // @ts-ignore
        minAge: c.minVehiculoAge,
        // @ts-ignore
        maxAge: c.maxVehiculoAge
    })));
}

main()
