"use client"
import { useState } from 'react';
import { Car, Offer, Image as CarImage } from '@prisma/client';
import CarCardCompact from './CarCardCompact';
import { Button } from './ui/button';

type CarWithImages = Car & { images: CarImage[]; offerImageUrl?: string | null };
type OfferWithCars = Offer & { cars: CarWithImages[] };

interface OfferSectionProps {
  offer: OfferWithCars;
}

export default function OfferSection({ offer }: OfferSectionProps) {
  const [visibleCars, setVisibleCars] = useState(6);

  const showMoreCars = () => {
    setVisibleCars(prev => prev + 6);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{offer.title}</h2>
        <p className="text-lg text-gray-600 text-center mb-8">{offer.description || ''}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offer.cars.slice(0, visibleCars).map(car => (
            <CarCardCompact key={car.id} car={car} />
          ))}
        </div>
        {visibleCars < offer.cars.length && (
          <div className="text-center mt-8">
            <Button onClick={showMoreCars} variant="secondary">
              Ver más
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

