import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  const role = session.user.role;
  return ['ADMIN', 'SUPER_ADMIN', 'DEALERSHIP_ADMIN'].includes(role);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid offer ID' }, { status: 400 });
    }

    await prisma.offer.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error: unknown) {
    console.error('Failed to delete offer:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
} 