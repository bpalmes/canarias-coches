"use client";
import { useState } from 'react';
import Image from 'next/image';
import { CarImage } from '@/utils/types';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface CarImageGalleryProps {
  images: CarImage[];
  carName: string;
  sidebarHeight?: boolean;
}

export default function CarImageGallery({ images, carName, sidebarHeight = false }: CarImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  if (!images || images.length === 0) {
    return (
      <div className={sidebarHeight ? 'h-full flex flex-col' : ''}>
        <div className={`${sidebarHeight ? 'flex-1 min-h-0' : 'aspect-[4/3]'} bg-white rounded-xl flex items-center justify-center relative`}>
          <Image src={'/placeholder.svg'} alt="Placeholder Image" width={750} height={421} className="object-contain w-full h-full rounded-xl" priority />
          <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">Sin imágenes</span>
        </div>
      </div>
    );
  }

  // Filter out images that have failed to load
  const validImages = images.filter((_, index) => !imageErrors.has(index));
  
  if (validImages.length === 0) {
    return (
      <div className={sidebarHeight ? 'h-full flex flex-col' : ''}>
        <div className={`${sidebarHeight ? 'flex-1 min-h-0' : 'aspect-[4/3]'} bg-white rounded-xl flex items-center justify-center relative`}>
          <Image src={'/placeholder.svg'} alt="Placeholder Image" width={750} height={421} className="object-contain w-full h-full rounded-xl" priority />
          <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">Sin imágenes</span>
        </div>
      </div>
    );
  }

  const goTo = (idx: number) => setCurrentIndex((idx + validImages.length) % validImages.length);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
    // If current image fails, move to next valid image
    if (index === currentIndex && validImages.length > 1) {
      const nextIndex = (index + 1) % validImages.length;
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className={sidebarHeight ? 'h-full flex flex-col' : ''}>
      {/* Imagen principal */}
      <div className={`${sidebarHeight ? 'flex-1 min-h-0' : 'aspect-[4/3]'} rounded-xl overflow-hidden relative bg-white`}>
        {/* Flecha izquierda */}
        {validImages.length > 1 && (
          <button 
            onClick={() => goTo(currentIndex - 1)} 
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        
        {/* Imagen */}
        <ImageCropper
          src={validImages[currentIndex].url}
          alt={carName}
          className="w-full h-full rounded-xl"
          objectFit="contain"
          onError={() => handleImageError(currentIndex)}
        />
        
        {/* Flecha derecha */}
        {validImages.length > 1 && (
          <button 
            onClick={() => goTo(currentIndex + 1)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
        
        {/* Contador */}
        <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {String(currentIndex + 1)}/{String(validImages.length)}
        </span>
        
        {/* Botón ver interior y zoom */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button className="bg-white/90 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full shadow text-xs">
            Ver interior
          </button>
          <button className="bg-white/90 hover:bg-blue-100 rounded-full p-2 shadow flex items-center justify-center">
            <ZoomIn className="w-5 h-5 text-blue-700" />
          </button>
        </div>
      </div>
      
      {/* Miniaturas - exactamente como Clicars */}
      {validImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageCropper
                src={image.url}
                alt={`${carName} - Imagen ${index + 1}`}
                className="object-contain w-full h-full"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 