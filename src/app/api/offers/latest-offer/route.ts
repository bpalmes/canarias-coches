import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const latestOffer = await prisma.offer.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestOffer) {
      return NextResponse.json({ message: 'No offers found' }, { status: 404 });
    }

    return NextResponse.json(latestOffer);
  } catch (error) {
    console.error('Error fetching latest offer:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

