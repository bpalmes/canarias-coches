
import { parseStringPromise } from 'xml2js';

const FEED_URL = 'https://feeds.inventario.pro/feed/Individual/515/hfvq97q43q0';

async function main() {
    process.stdout.write('Fetching feed...\n');
    const response = await fetch(FEED_URL);
    const text = await response.text();

    const parsed = await parseStringPromise(text, { explicitArray: false });
    const ads = Array.isArray(parsed.standard.ad) ? parsed.standard.ad : [parsed.standard.ad];
    // Inspect first 5 items
    const sample = ads.slice(0, 5);

    sample.forEach((item, index) => {
        console.log(`\n--- ITEM ${index + 1} ---`);
        Object.keys(item).forEach(key => {
            const k = key.toLowerCase();
            if (k.includes('price') || k.includes('precio') || k.includes('amount') || k.includes('pvp') || k.includes('cost') || k === 'id') {
                console.log(`${key}: ${JSON.stringify(item[key])}`);
            }
        });
    });
}

main().catch(console.error);
