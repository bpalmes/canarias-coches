import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Car, Offer } from '@prisma/client';
import OfferCarsManager from '@/components/OfferCarsManager';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface ManageOfferPageProps {
  params: Promise<{ id: string }>;
}

async function getOfferWithCars(id: number): Promise<(Offer & { cars: Car[] }) | null> {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      cars: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  });
}

export default async function ManageOfferPage({ params }: ManageOfferPageProps) {
  const { id } = await params;
  const offerId = parseInt(id, 10);
  if (isNaN(offerId)) {
    return notFound();
  }

  const offer = await getOfferWithCars(offerId);

  if (!offer) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Gestionar Oferta</h1>
      <h2 className="text-xl text-gray-600 mb-6">{offer.title}</h2>
      <OfferCarsManager initialCars={offer.cars} offerId={offer.id} />
    </div>
  );
}

