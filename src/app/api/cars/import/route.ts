import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

interface CsvRow {
  'SKU': string;
  'Name': string;
  'Published': string;
  'Is featured?': string;
  'Visibility in catalog': string;
  'Short description': string;
  'Description': string;
  'Regular price': string;
  'Sale price': string;
  'Currency': string;
  'In stock?': string;
  'Stock': string;
  'Images': string;
  'Attribute 1 name': string;
  'Attribute 1 value(s)': string;
  'Attribute 2 name': string;
  'Attribute 2 value(s)': string;
  'Attribute 3 name': string;
  'Attribute 3 value(s)': string;
  'Attribute 4 name': string;
  'Attribute 4 value(s)': string;
  'Attribute 5 name': string;
  'Attribute 5 value(s)': string;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileContent = await file.text();
    
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
    });

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

    await prisma.$transaction(async (tx) => {
      for (const row of parsed.data as CsvRow[]) {
        const regularPrice = parseFloat(row['Regular price']);
        if (!row['SKU'] || !row['Name'] || isNaN(regularPrice)) {
          errors.push(`Skipping row due to missing SKU, name, or invalid price: ${JSON.stringify(row)}`);
          continue;
        }

        const carData = {
          name: row['Name'],
          published: row['Published'] === '1',
          isFeatured: row['Is featured?'] === '1',
          visibility: row['Visibility in catalog'],
          shortDescription: row['Short description'],
          description: row['Description'],
          regularPrice: regularPrice,
          salePrice: row['Sale price'] ? parseFloat(row['Sale price']) : null,
          currency: row['Currency'] || 'EUR',
          inStock: row['In stock?'] === '1',
          stock: row['Stock'] ? parseInt(row['Stock'], 10) : 1,
        };
        
        const imageUrlsRaw = (row['Images'] || '').split(',');
        const imageUrls = imageUrlsRaw.map((url: string) => ({ url: url.trim() })).filter((img: {url: string}) => img.url);

        try {
          const car = await tx.car.upsert({
            where: { sku: row['SKU'] },
            update: {
              ...carData,
              source: 'manual', // Marcar como importación manual
              images: { deleteMany: {}, create: imageUrls },
            },
            create: {
              sku: row['SKU'],
              source: 'manual', // Marcar como importación manual
              ...carData,
              images: { create: imageUrls },
            },
          });
          
          if (car.createdAt.getTime() === car.updatedAt.getTime()) {
            createdCount++;
          } else {
            updatedCount++;
          }
        } catch (e: unknown) {
          const error = e as Error;
          errors.push(`Failed to process row for car "${row['Name']}": ${error.message}`);
        }
      }
    });

    return NextResponse.json({
      message: `Coches creados: ${createdCount}, Coches actualizados: ${updatedCount}. Errores: ${errors.length}`,
      created: createdCount,
      updated: updatedCount,
      errors: errors,
    });

  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 