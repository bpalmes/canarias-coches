import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  return ['ADMIN', 'SUPER_ADMIN', 'DEALERSHIP_ADMIN'].includes(session.user.role);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación de admin
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id: parsedId },
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { source: 'asc' },
          ]
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Failed to fetch car:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 