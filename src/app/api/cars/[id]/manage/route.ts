import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/config';

async function verifyAdmin(req: NextRequest) {
  // Prefer cookie token
  let token = req.cookies.get('authToken')?.value;
  // Fallback to Authorization header (Bearer <token>) if cookie missing
  if (!token) {
    const auth = req.headers.get('authorization') || '';
    const m = auth.match(/^Bearer\s+(.*)$/i);
    if (m) token = m[1];
  }
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload as { role?: string })?.role === 'ADMIN';
  } catch (error) {
    console.error('JWT verify error:', error);
    return false;
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id, 10);
  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
  }

  try {
    const { isSold } = await req.json();
    
    if (typeof isSold !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isSold value' }, { status: 400 });
    }

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: { isSold },
    });

    return NextResponse.json(updatedCar);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = await params;
    const carId = parseInt(id, 10);
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get('offerId');

    if (isNaN(carId) || !offerId || isNaN(parseInt(offerId))) {
      return NextResponse.json({ error: 'Invalid car or offer ID' }, { status: 400 });
    }
  
    try {
      await prisma.offer.update({
        where: { id: parseInt(offerId) },
        data: {
          cars: {
            disconnect: { id: carId },
          },
        },
      });
  
      return NextResponse.json({ message: 'Car removed from offer successfully' });
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

