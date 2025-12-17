import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/config';

async function verifyAdmin(req: NextRequest) {
  // Try cookie first
  let token = req.cookies.get('authToken')?.value;
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
  } catch {
    return false;
  }
}

const generateSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  return `${slug}-${Date.now()}`; // Add timestamp for uniqueness
};

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { 
      title, 
      cars, 
      hasPromotionalBanner, 
      bannerImageUrl, 
      // bannerTitle, 
      // bannerSubtitle, 
      bannerSize,
      offerTitle,
      offerSubtitle,
      innerImageUrl,
      coverImageUrl
    } = await req.json();

    if (!title || !cars || !Array.isArray(cars) || cars.length === 0) {
      return NextResponse.json({ error: 'Invalid data: Title and at least one car are required' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const newOffer = await prisma.offer.create({
      data: {
        title,
        slug,
        hasPromotionalBanner: hasPromotionalBanner || false,
        bannerImageUrl: hasPromotionalBanner ? bannerImageUrl : null,
        // bannerTitle: hasPromotionalBanner ? bannerTitle : null,
        // bannerSubtitle: hasPromotionalBanner ? bannerSubtitle : null,
        bannerSize: hasPromotionalBanner ? bannerSize : null,
        offerTitle: offerTitle || null,
        offerSubtitle: offerSubtitle || null,
        innerImageUrl: innerImageUrl || null,
        coverImageUrl: coverImageUrl || null,
        cars: {
          connect: cars.map((carId: number) => ({ id: carId })),
        },
      },
      include: {
        cars: true, // Include the related cars in the response
      },
    });

    return NextResponse.json(newOffer, { status: 201 });

  } catch (error) {
    console.error('Offer creation error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const offers = await prisma.offer.findMany({
            include: {
                _count: {
                    select: { cars: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(offers);
    } catch (error) {
        console.error('Failed to fetch offers:', error);
        return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
    }
} 
