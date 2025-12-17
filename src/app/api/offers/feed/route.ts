import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        cars: {
          include: {
            images: {
              orderBy: { isPrimary: 'desc' },
              take: 1,
            },
          },
        },
      },
    });
    
    console.log('📋 Offers found:', offers.length);
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Failed to fetch offers feed:', error);
    return NextResponse.json({ message: 'Failed to fetch offers feed' }, { status: 500 });
  }
}

