import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function DELETE(
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

    const image = await prisma.image.findUnique({
      where: { id: parsedId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found in database' }, { status: 404 });
    }

    if (image.source === 'manual') {
      await del(image.url);
    }
    
    await prisma.image.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: unknown) {
    console.error('Failed to delete image:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 