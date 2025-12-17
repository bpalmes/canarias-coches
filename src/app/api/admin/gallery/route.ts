import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todas las imágenes de la galería
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Error al obtener las imágenes de la galería' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva imagen de galería
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, order } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Título e imagen son requeridos' },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description,
        imageUrl,
        order: order || 0
      }
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { error: 'Error al crear la imagen de galería' },
      { status: 500 }
    );
  }
}


