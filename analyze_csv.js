
const fs = require('fs');
const Papa = require('papaparse');

const fileContent = fs.readFileSync('entidades_nuevoformato.csv', 'utf8');
const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
});

const data = result.data;
console.log(`Total Rows in CSV: ${data.length}`);

const uniqueKeys = new Set();
const duplicates = [];

data.forEach((row, index) => {
    // Handle Typo
    const campType = row.campaña_tipo !== undefined ? row.campaña_tipo : row.camapaña_tipo;

    // Resolve IDs
    const entityId = row.entity_id || row.entityId;
    const tin = row.tin;
    const plazo = row.plazo;
    const calcType = row.calculo_tipo;

    const key = `${entityId}-${campType}-${tin}-${plazo}-${calcType}`;

    if (uniqueKeys.has(key)) {
        duplicates.push({ index: index + 2, key }); // +2 for 1-based index and header
    } else {
        uniqueKeys.add(key);
    }
});

console.log(`Unique Keys: ${uniqueKeys.size}`);
console.log(`Duplicates Found: ${duplicates.length}`);
if (duplicates.length > 0) {
    console.log('First 5 duplicates:', duplicates.slice(0, 5));
}

// Check distribution of campaign types
const campCounts = {};
data.forEach(row => {
    const t = row.campaña_tipo !== undefined ? row.campaña_tipo : row.camapaña_tipo;
    campCounts[t] = (campCounts[t] || 0) + 1;
});
console.log('Campaign Type Distribution:', campCounts);

// Check distribution of entities
const entityCounts = {};
data.forEach(row => {
    const id = row.entity_id || row.entityId;
    entityCounts[id] = (entityCounts[id] || 0) + 1;
});
console.log('Entity Distribution:', entityCounts);
