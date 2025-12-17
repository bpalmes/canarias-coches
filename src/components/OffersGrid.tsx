"use client";
import { Offer } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type OfferWithCars = Offer & { 
  cars: Array<{
    id: number;
    name: string;
    regularPrice: number;
    monthlyFinancingFee?: number | null;
    images: Array<{
      url: string;
      isPrimary: boolean;
    }>;
  }>;
};

interface OffersGridProps {
  offers: OfferWithCars[];
}

export default function OffersGrid({ offers }: OffersGridProps) {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Título principal */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Vehículos Seleccionados con Condiciones Especiales
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encuentra promociones activas por tiempo limitado en todas nuestras islas. 
            Elige la campaña que más se adapta a ti.
          </p>
        </div>

        {/* Grid de ofertas - Solo imágenes limpias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Link 
              key={offer.id} 
              href={`/ofertas/${offer.slug}`}
              className="group block overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
            >
              {/* Solo imagen de portada - responsive para móvil */}
              <div className="relative h-[21.6rem] sm:h-[27rem] bg-gray-100">
                {offer.coverImageUrl ? (
                  <Image
                    src={offer.coverImageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">Sin imagen de portada</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Botón para ver todas las ofertas */}
        <div className="text-center mt-12">
          <Link 
            href="/ofertas"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todas las ofertas
          </Link>
        </div>
      </div>
    </div>
  );
}
