"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Clock, Droplet, Zap, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Car {
  id: number;
  name: string;
  year: number | null;
  kms: number | null;
  transmission: string | null;
  fuel: string | null;
  regularPrice: number;
  financedPrice: number | null;
  images: { url: string; isPrimary?: boolean }[];
  offerImageUrl?: string | null;
  isSold?: boolean;
}

interface CarCardOfferProps {
  car: Car;
}

const FuelIcon = ({ type }: { type: string | null }) => {
  const lowerType = type?.toLowerCase();
  if (lowerType?.includes('eléctrico')) return <Zap className="h-4 w-4 text-secondary" />;
  if (lowerType?.includes('gasolina') || lowerType?.includes('diésel')) return <Droplet className="h-4 w-4 text-gray-400" />;
  return null;
};

export default function CarCardOffer({ car }: CarCardOfferProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px', // Cargar antes de que sea visible
  });

  const [aspectClass, setAspectClass] = useState('aspect-[4/3]');
  const [imageError, setImageError] = useState(false);

  // Priorizar la imagen de oferta si existe, sino usar la imagen principal
  const displayImage = car.offerImageUrl ||
    (car.images.find(img => img.isPrimary) || car.images[0])?.url;

  useEffect(() => {
    if (displayImage) {
      // Preload image to determine aspect ratio
      const img = new window.Image();
      img.src = displayImage;
      img.onload = () => {
        const ar = img.naturalWidth / img.naturalHeight;
        if (ar > 0.95 && ar < 1.05) {
          setAspectClass('aspect-square');
        }
      };
      img.onerror = () => {
        setImageError(true);
      };
    }
  }, [displayImage]);

  const monthlyPayment = car.financedPrice ? (car.financedPrice / 72).toFixed(0) : (car.regularPrice / 72).toFixed(0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transition-shadow hover:shadow-xl"
    >
      <div className={`relative w-full bg-gray-100 overflow-hidden ${aspectClass}`}>
        {displayImage && !imageError && inView ? (
          <Image
            src={displayImage}
            alt={car.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              console.log(`❌ Imagen falló al cargar:`, displayImage);
              setImageError(true);
            }}
            onLoad={() => {
              console.log(`✅ Imagen cargó exitosamente:`, displayImage);
            }}
            priority={false} // Lazy loading
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              width={200}
              height={150}
              className="object-contain opacity-50"
              priority={false}
            />
          </div>
        )}

        {/* Indicador de foto de oferta */}
        {car.offerImageUrl && (
          <div className="absolute top-2 left-2">
            <div className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Oferta Especial
            </div>
          </div>
        )}

        {car.isSold && (
          <motion.div
            initial={{ scale: 1.3, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="rounded-md border-4 px-6 py-2 shadow-lg"
              style={{ borderColor: '#93c01f', transform: 'rotate(-12deg)', background: 'rgba(255,255,255,0.7)' }}
            >
              <span
                className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest"
                style={{ color: '#93c01f', textShadow: '0 3px 8px rgba(0,0,0,0.25)' }}
              >
                Vendido
              </span>
            </div>
          </motion.div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg leading-tight mt-1 truncate group-hover:text-secondary">{car.name}</h3>

        <div className="text-xs text-gray-500 my-3 flex flex-wrap gap-x-3 gap-y-1">
          {car.year && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {car.year}</span>}
          {car.kms !== null && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {new Intl.NumberFormat('es-ES').format(car.kms)} km</span>}
          {car.transmission && <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {car.transmission}</span>}
        </div>

        <div className="mt-auto pt-2 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FuelIcon type={car.fuel} />
              <span className="text-sm font-medium">{car.fuel}</span>
            </div>
            {car.financedPrice && (
              <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Desde {monthlyPayment}€/mes
              </div>
            )}
          </div>
          <div className="flex justify-between items-end">
            {/* Precio al contado tachado (solo si hay precio financiado) */}
            {car.financedPrice && (
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-1">Precio Contado</p>
                <p className="text-sm text-gray-500 line-through">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(car.regularPrice)}
                </p>
              </div>
            )}
            {/* Precio principal */}
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">
                {car.financedPrice ? 'Precio Financiado' : 'Precio Contado'}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(car.financedPrice || car.regularPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




