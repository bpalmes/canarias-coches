import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener imágenes activas de la galería para el frontend público
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        order: true
      }
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching public gallery images:', error);
    return NextResponse.json(
      { error: 'Error al obtener las imágenes de la galería' },
      { status: 500 }
    );
  }
}


