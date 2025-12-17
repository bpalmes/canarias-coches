import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const imageToUpdate = await prisma.image.findUnique({
      where: { id: parsedId },
    });

    if (!imageToUpdate) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.image.updateMany({
        where: {
          carId: imageToUpdate.carId,
          NOT: { id: parsedId },
        },
        data: { isPrimary: false },
      }),
      prisma.image.update({
        where: { id: parsedId },
        data: { isPrimary: true },
      }),
    ]);

    return NextResponse.json({ message: 'Primary image updated successfully' });
  } catch (error) {
    console.error('Failed to set primary image:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 