
const fs = require('fs');
const Papa = require('papaparse');

const csvFile = fs.readFileSync('entidades_nuevoformato.csv', 'utf8');

Papa.parse(csvFile, {
    header: true,
    complete: function (results) {
        const uniqueEntities = new Map();
        results.data.forEach(row => {
            const id = row.entity_id || row.entityId;
            // Handle typo in CSV header: 'camapaÃ±a_tipo' if it appears
            // But we just want ID and Name
            if (id) {
                let name = row.name;
                if (name && typeof name === 'string') {
                    name = name.split(' - ')[0].trim();
                }
                if (!uniqueEntities.has(id)) {
                    uniqueEntities.set(id, name);
                }
            }
        });

        console.log("--- Unique Entities Found ---");
        uniqueEntities.forEach((name, id) => {
            console.log(`ID: ${id} | Name: ${name}`);
        });
    }
});
