import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;

  // Allow SUPER_ADMIN, ADMIN, and DEALERSHIP_ADMIN
  const role = session.user.role;
  return ['ADMIN', 'SUPER_ADMIN', 'DEALERSHIP_ADMIN'].includes(role);
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
