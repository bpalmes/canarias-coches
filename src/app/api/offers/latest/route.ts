import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Encontrar la oferta más reciente
    const latestOffer = await prisma.offer.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // 2. Incluir los coches asociados a esa oferta
        cars: {
          include: {
            images: true, // Incluir imágenes para las tarjetas
          },

        },
      },
    });

    if (!latestOffer) {
      return NextResponse.json({ cars: [] });
    }

    // 3. Devolver los coches de la última oferta
    return NextResponse.json(latestOffer.cars);

  } catch (error) {
    console.error('Failed to fetch latest offer cars:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
