"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Offer {
  id: number;
  title: string;
  slug: string;
  coverImageUrl?: string | null;
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
}

export default function FeaturedOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers/feed');
        if (!response.ok) throw new Error('Failed to fetch offers');
        
        const allOffers = await response.json();
        // Mostrar solo las 3 últimas ofertas
        setOffers(allOffers.slice(0, 3));
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-white pt-20 pb-12 z-10">
        <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
          {/* Cabecera con imagen lateral montada parcialmente sobre el hero */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 items-start gap-4">
            <div className="flex justify-center md:justify-end -mt-24 md:-mt-32 md:-mr-8">
              <Image
                src="/da4b1e18005fecdf893baf1e80d2e20b0c15e062.png"
                alt="Decoración ofertas"
                width={374}
                height={374}
                className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] object-contain"
                priority
              />
            </div>
            <div className="text-center md:text-left md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-3">Últimas Ofertas</h2>
              <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
                Encuentra <strong>promociones activas</strong> por tiempo limitado en todas nuestras islas. Elige la campaña que más se adapte a tus necesidades.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return (
      <section className="relative bg-white pt-20 pb-12 z-10">
      <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
        {/* Cabecera con imagen lateral montada parcialmente sobre el hero */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 items-start gap-4">
          <div className="flex justify-center md:justify-end -mt-24 md:-mt-32 md:-mr-8">
            <Image
              src="/da4b1e18005fecdf893baf1e80d2e20b0c15e062.png"
              alt="Decoración ofertas"
              width={374}
              height={374}
              className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] object-contain"
              priority
            />
          </div>
          <div className="text-center md:text-left md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-3">Últimas Ofertas</h2>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
              Encuentra <strong>promociones activas</strong> por tiempo limitado en todas nuestras islas. Elige la campaña que más se adapte a tus necesidades.
            </p>
          </div>
        </div>
          <div className="text-center text-gray-500">
            No hay ofertas disponibles en este momento.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white pt-20 pb-4 z-10">
      <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
        {/* Cabecera con imagen lateral montada parcialmente sobre el hero */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 items-start gap-4">
          <div className="flex justify-center md:justify-end -mt-24 md:-mt-32 md:-mr-8">
            <Image
              src="/da4b1e18005fecdf893baf1e80d2e20b0c15e062.png"
              alt="Decoración ofertas"
              width={374}
              height={374}
              className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] object-contain"
              priority
            />
          </div>
          <div className="text-center md:text-left md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-3">Últimas Ofertas</h2>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
              Encuentra <strong>promociones activas</strong> por tiempo limitado en todas nuestras islas. Elige la campaña que más se adapte a tus necesidades.
            </p>
          </div>
        </div>

        {/* Grid de ofertas - Solo imágenes limpias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Link 
              key={offer.id} 
              href={`/ofertas/${offer.slug}`}
              className="group block hover:scale-105 transition-transform duration-300"
            >
              {/* Solo imagen de portada - responsive para móvil */}
              <div className="relative aspect-square overflow-hidden">
                {offer.coverImageUrl ? (
                  <Image
                    src={offer.coverImageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">Sin imagen de portada</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}