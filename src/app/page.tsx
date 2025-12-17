import { Suspense } from 'react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedOffers from '@/components/FeaturedOffers';
import AboutAndStats from '@/components/AboutAndStats';
import Link from 'next/link';
import QuickSearchSection from '@/components/QuickSearchSection';
import Image from 'next/image';
import DeliveryGallery from '@/components/DeliveryGallery';
// import FeaturedCarsSkeleton from '@/components/FeaturedCarsSkeleton';
// import AboutAndStats from '@/components/AboutAndStats';
// import Reviews from '@/components/Reviews';
// import { prisma } from '@/lib/prisma';
// import CarStack from '@/components/CarStack';
// import { Car } from '@/utils/types';
// import { Image as PrismaImage } from '@prisma/client';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

// type CarWithImages = Car & { images: PrismaImage[] };

// async function getFeaturedCars(): Promise<CarWithImages[]> {
//   const cars = await prisma.car.findMany({
//     where: {
//       images: {
//         some: { id: { gt: 0 } }
//       }
//     },
//     include: {
//       images: {
//         orderBy: { isPrimary: 'desc' },
//         take: 1
//       }
//     },
//     orderBy: { updatedAt: 'desc' },
//     take: 8
//   });
//   return cars.map(car => ({
//     ...car,
//     kms: car.kms || 0,
//     year: car.year || 0,
//     fuel: car.fuel || '',
//     bodytype: car.bodytype || '',
//   })) as CarWithImages[];
// }

// function FeaturedCarsSection({ cars }: { cars: CarWithImages[] }) {
//   return (
//     <section className="bg-gray-100 py-24 sm:py-32">
//       <div className="container mx-auto px-6">
//         <div className="text-center md:text-left mb-16">
//           <h2 className="text-5xl md:text-7xl font-bold" style={{ color: '#0f286a' }}>
//             DESTACADOS
//           </h2>
//           <div className="mt-4 md:flex md:items-baseline md:justify-between">
//             <p className="text-lg text-gray-600 max-w-md">
//                 Estos son solo algunos ejemplos de lo que podemos ofrecer.
//             </p>
//             <p className="text-lg text-gray-600 max-w-md mt-4 md:mt-0">
//                 Echa un vistazo y descubre todas las posibilidades.
//             </p>
//           </div>
//         </div>
//         <div className="relative h-[600px] w-full">
//           <CarStack cars={cars} />
//         </div>
//       </div>
//     </section>
//   );
// }

export default async function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Últimas Ofertas (activa) */}
      <FeaturedOffers />

      {/* Formas de empezar a buscar (dinámico con inventario real) */}
      <QuickSearchSection />

      {/* Sección de reseñas */}
      <section className="py-4 bg-white">
        <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
          <Image
            src="/reseñas.png"
            alt="Reseñas y puntuación de confianza Miguel León"
            width={1390}
            height={344}
            className="w-full h-auto"
            priority={false}
          />
        </div>
      </section>

      {/* Entregas que Apasionan */}
      <section className="py-0 bg-gray-50">
        <div className="relative mx-auto w-full h-[858px] max-w-[1390px] px-6 md:px-24 max-md:h-auto">
          {/* Fondo blanco con borde */}
          <div className="absolute left-6 md:left-24 right-6 md:right-24 bg-white border border-solid border-zinc-200 h-[560px] rounded-[40px] top-[136px]"></div>
          
          {/* Imagen de llaves - superpuesta con la sección anterior */}
          <Image
            src="/llaves.png"
            alt="Llaves de entrega"
            width={400}
            height={400}
            className="object-cover absolute -top-20 h-[400px] left-[86px] md:left-[110px] w-[400px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-8 max-md:w-full max-md:h-auto"
          />
          
          {/* Título */}
          <div className="absolute text-4xl font-bold tracking-tighter h-[62px] left-[520px] md:left-[501px] text-blue-950 top-[186px] w-[477px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-6 max-md:w-full max-md:text-3xl max-md:text-center max-sm:text-3xl">
            Entregas que Apasionan
          </div>
          
          {/* Descripción */}
          <div className="absolute text-base h-[54px] left-[520px] md:left-[501px] text-neutral-600 top-[258px] w-[528px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-10 max-md:w-full max-md:text-center max-sm:text-sm">
            <div>
              Cada entrega es un momento especial. Descubre cómo hacemos que <span className="font-bold">tu experiencia</span> sea única desde el primer contacto hasta las llaves en tus manos.
            </div>
          </div>
          
          {/* Galería de imágenes - Carrusel dinámico del backend */}
          <DeliveryGallery />
        </div>
      </section>

      {/* Contadores / métricas */}
      <AboutAndStats />

      {/* Secciones comentadas temporalmente */}
      {/**
       * <Suspense fallback={<FeaturedCarsSkeleton />}>
       *   <FeaturedCarsSection cars={cars} />
       * </Suspense>
       * <Reviews />
       * <AboutAndStats />
       */}
    </div>
  );
}
