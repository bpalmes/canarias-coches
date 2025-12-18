import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  // Allow all admin types to search cars
  const role = session.user.role;
  return ['ADMIN', 'SUPER_ADMIN', 'DEALERSHIP_ADMIN'].includes(role);
}

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term') || '';
    const results = await prisma.car.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { numberplate: { contains: term, mode: 'insensitive' } },
        ]
      },
      include: {
        images: true,
      },
      take: 20,
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
} 