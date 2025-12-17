"use client";
import { useState } from 'react';
import Image from 'next/image';

interface PromotionalBannerProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  size: 'small' | 'medium' | 'large';
}

export default function PromotionalBanner({ 
  imageUrl, 
  title, 
  // subtitle, 
  size 
}: PromotionalBannerProps) {
  const [imageError, setImageError] = useState(false);

  // Configuración de tamaños responsive - Aumentados para ser casi el doble
  const sizeConfig = {
    small: {
      container: 'h-96 md:h-[24rem] lg:h-[28rem]',
      image: 'h-80 md:h-96 lg:h-[24rem]',
      title: 'text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-base md:text-lg lg:text-xl'
    },
    medium: {
      container: 'h-[24rem] md:h-[32rem] lg:h-[36rem]',
      image: 'h-96 md:h-[28rem] lg:h-[32rem]',
      title: 'text-4xl md:text-5xl lg:text-6xl',
      subtitle: 'text-lg md:text-xl lg:text-2xl'
    },
    large: {
      container: 'h-[28rem] md:h-[36rem] lg:h-[40rem]',
      image: 'h-[24rem] md:h-[32rem] lg:h-[36rem]',
      title: 'text-5xl md:text-6xl lg:text-7xl',
      subtitle: 'text-xl md:text-2xl lg:text-3xl'
    }
  };

  const config = sizeConfig[size];

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="mt-24"> {/* Espacio del header - 3 dedos más */}
      <div className={`relative w-full ${config.container} bg-white overflow-hidden`}>
        {/* Imagen de fondo */}
        <div className={`relative w-full ${config.image} flex items-center justify-center`}>
          {!imageError ? (
            imageUrl.startsWith('data:') ? (
              // Imagen base64 (desarrollo)
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              // Imagen URL (producción con Vercel Blob)
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain"
                onError={handleImageError}
                priority
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Error al cargar imagen</span>
            </div>
          )}
        </div>

        {/* Overlay de texto - COMENTADO */}
        {/* <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 md:p-6 max-w-2xl text-center">
            <h1 className={`font-bold text-blue-900 mb-2 ${config.title}`}>
              {title}
            </h1>
            
            <p className={`text-blue-800 font-medium ${config.subtitle}`}>
              {subtitle}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
