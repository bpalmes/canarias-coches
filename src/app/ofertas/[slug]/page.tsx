import CarCardCompact from '@/components/CarCardCompact';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import PromotionalBanner from '@/components/PromotionalBanner';
import { Car, Image as CarImage } from '@prisma/client';
import Image from 'next/image';
import DeliveryGallery from '@/components/DeliveryGallery';
import AboutAndStats from '@/components/AboutAndStats';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface OfferPageProps {
  params: Promise<{
    slug: string;
  }>;
}

type CarWithImages = Car & { images: CarImage[]; offerImageUrl?: string | null };

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = await prisma.offer.findUnique({
    where: { slug: slug },
    include: {
      cars: {
        include: {
          images: {
            orderBy: {
              isPrimary: 'desc'  // Primero las primarias, luego las demás
            },
            take: 1  // Solo cargar 1 imagen por coche
          },
        },
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const carItems = offer.cars.map((car) => ({
    id: car.id,
    link: `/car/${car.id}`,
    children: <CarCardCompact car={car as CarWithImages} />,
  }));

  const words = offer.title.split(" ").map((word, index) => ({
    text: word,
    className: index > 2 ? "text-blue-500 dark:text-blue-500" : "",
  }));

  return (
    <>
      {/* Banner promocional */}
      {offer.hasPromotionalBanner && offer.bannerImageUrl && (
        <div className="pt-24">
          <PromotionalBanner
            imageUrl={offer.bannerImageUrl}
            title=""
            subtitle=""
            size={offer.bannerSize as 'small' | 'medium' | 'large' || 'medium'}
          />
        </div>
      )}

      {/* Imagen interior grande (Hero) */}
      {offer.innerImageUrl && (
        <div className="pt-16">
          <img
            src={offer.innerImageUrl}
            alt={offer.offerTitle || offer.title}
            className="w-full h-auto block"
            style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'top' }}
          />
        </div>
      )}

      <div className="bg-gray-50">
      
      {/* Sección de título personalizado */}
      {(offer.offerTitle || offer.offerSubtitle) && (
        <header className="flex overflow-hidden flex-col items-center bg-gray-50 py-14">
          {offer.offerTitle && (
            <h1 className="text-5xl tracking-tighter text-center leading-[50px] text-blue-950 max-md:max-w-full max-md:text-4xl max-md:leading-[49px] font-[family-name:var(--font-poppins)]">
              {offer.offerTitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < offer.offerTitle!.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
          )}
          {offer.offerSubtitle && (
            <p className="mt-5 text-base text-center text-neutral-600 max-md:max-w-full font-[family-name:var(--font-lato)]">
              {offer.offerSubtitle}
            </p>
          )}
        </header>
      )}
      
      {/* Grid de coches - Simple sin carrusel */}
      <div className="mx-auto px-6 md:px-24 py-12 max-w-[1390px]">
        <HoverEffect items={carItems} className="lg:grid-cols-4 gap-5" />
      </div>

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
          <div className="absolute text-4xl font-bold tracking-tighter h-[62px] left-[520px] md:left-[544px] text-blue-950 top-[186px] w-[477px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-6 max-md:w-full max-md:text-3xl max-md:text-center max-sm:text-3xl">
            Entregas que Apasionan
          </div>
          
          {/* Descripción */}
          <div className="absolute text-base h-[54px] left-[520px] md:left-[544px] text-neutral-600 top-[258px] w-[528px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-10 max-md:w-full max-md:text-center max-sm:text-sm">
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
      </div>
    </>
  );
}

export async function generateMetadata({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = await prisma.offer.findUnique({ where: { slug: slug } });
  if (!offer) return { title: 'Oferta no encontrada' };
  return {
    title: `Oferta: ${offer.title}`,
    description: `Detalles de la oferta especial "${offer.title}".`,
  };
}
