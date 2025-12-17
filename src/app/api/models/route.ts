import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener todos los modelos únicos de la base de datos
    const models = await prisma.car.findMany({
      select: {
        make: true,
        model: true,
      },
      where: {
        make: { not: null },
        model: { not: null },
      },
      distinct: ['make', 'model'],
      orderBy: [
        { make: 'asc' },
        { model: 'asc' }
      ]
    });

    // Crear array de modelos únicos combinando marca y modelo
    const uniqueModels = models
      .map(car => `${car.make} ${car.model}`)
      .filter((model, index, array) => array.indexOf(model) === index)
      .sort();

    return NextResponse.json({
      success: true,
      models: uniqueModels,
      total: uniqueModels.length
    });

  } catch (error) {
    console.error('Error obteniendo modelos:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


