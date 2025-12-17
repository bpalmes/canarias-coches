import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    const cars = await prisma.car.findMany({
      include: {
        images: {
          orderBy: {
            isPrimary: 'desc'  // Primero las primarias, luego las demás
          },
          take: 1  // Solo cargar 1 imagen por coche
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit && { take: parseInt(limit) })  // Aplicar límite si se proporciona
    });

    return NextResponse.json(cars);

  } catch (error) {
    console.error('Failed to fetch cars:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
} 