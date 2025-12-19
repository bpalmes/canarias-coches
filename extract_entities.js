
const fs = require('fs');
const Papa = require('papaparse');

const fileContent = fs.readFileSync('entidades_nuevoformato.csv', 'utf8');
const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
});

const data = result.data;
const entities = {};

data.forEach(row => {
    const id = row.entity_id || row.entityId;
    const name = row.name; // entity_name?
    // Based on previous reads, CSV has 'name' which seems to be the Entity Name + Config Name sometimes
    if (id && name) {
        if (!entities[id]) {
            entities[id] = name;
        }
    }
});

console.log('Entities found:', entities);
