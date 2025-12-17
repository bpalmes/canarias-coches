const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validateImageUrls() {
  console.log('🔍 Validando URLs de imágenes en la base de datos...\n');

  try {
    // Obtener todas las imágenes
    const images = await prisma.image.findMany({
      include: {
        car: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    console.log(`📊 Total de imágenes encontradas: ${images.length}\n`);

    const results = {
      valid: [],
      invalid: [],
      errors: [],
    };

    // Validar cada URL
    for (const image of images) {
      try {
        const response = await fetch(image.url, { method: 'HEAD' });
        
        if (response.ok) {
          results.valid.push({
            id: image.id,
            url: image.url,
            car: image.car,
            status: response.status,
            contentType: response.headers.get('content-type'),
          });
        } else {
          results.invalid.push({
            id: image.id,
            url: image.url,
            car: image.car,
            status: response.status,
            error: `HTTP ${response.status}`,
          });
        }
      } catch (error) {
        results.errors.push({
          id: image.id,
          url: image.url,
          car: image.car,
          error: error.message,
        });
      }
    }

    // Mostrar resultados
    console.log('✅ Imágenes válidas:', results.valid.length);
    console.log('❌ Imágenes inválidas:', results.invalid.length);
    console.log('🚫 Errores de conexión:', results.errors.length);
    console.log('\n');

    if (results.invalid.length > 0) {
      console.log('❌ URLs inválidas:');
      results.invalid.forEach(img => {
        console.log(`  - ID: ${img.id} | Car: ${img.car.name} (${img.car.sku})`);
        console.log(`    URL: ${img.url}`);
        console.log(`    Status: ${img.status}`);
        console.log('');
      });
    }

    if (results.errors.length > 0) {
      console.log('🚫 Errores de conexión:');
      results.errors.forEach(img => {
        console.log(`  - ID: ${img.id} | Car: ${img.car.name} (${img.car.sku})`);
        console.log(`    URL: ${img.url}`);
        console.log(`    Error: ${img.error}`);
        console.log('');
      });
    }

    // Estadísticas por fuente
    const sourceStats = {};
    images.forEach(img => {
      const source = img.source || 'unknown';
      if (!sourceStats[source]) {
        sourceStats[source] = { total: 0, valid: 0, invalid: 0, errors: 0 };
      }
      sourceStats[source].total++;
      
      const isValid = results.valid.find(v => v.id === img.id);
      const isInvalid = results.invalid.find(v => v.id === img.id);
      const hasError = results.errors.find(v => v.id === img.id);
      
      if (isValid) sourceStats[source].valid++;
      else if (isInvalid) sourceStats[source].invalid++;
      else if (hasError) sourceStats[source].errors++;
    });

    console.log('📈 Estadísticas por fuente:');
    Object.entries(sourceStats).forEach(([source, stats]) => {
      const percentage = ((stats.valid / stats.total) * 100).toFixed(1);
      console.log(`  ${source}: ${stats.valid}/${stats.total} válidas (${percentage}%)`);
    });

  } catch (error) {
    console.error('❌ Error durante la validación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
validateImageUrls().catch(console.error);
