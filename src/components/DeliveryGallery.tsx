"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  order: number;
}

export default function DeliveryGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setImages(Array.isArray(data) ? data : []);
        } else {
          console.error('Error response from gallery API:', response.status);
          setImages([]);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(images.length / 4));
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + Math.ceil(images.length / 4)) % Math.ceil(images.length / 4));
    }
  };

  const getVisibleImages = () => {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }
    const startIndex = currentIndex * 4;
    return images.slice(startIndex, startIndex + 4);
  };

  if (loading) {
    return (
      <>
        {/* Placeholders mientras carga */}
        <div className="absolute h-[255px] left-[27px] md:left-[144px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center animate-pulse">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
        <div className="absolute h-[255px] left-[307px] md:left-[419px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center animate-pulse">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
        <div className="absolute h-[255px] left-[587px] md:left-[694px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center animate-pulse">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
        <div className="absolute h-[255px] left-[867px] md:left-[969px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center animate-pulse">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
      </>
    );
  }

  if (images.length === 0) {
    return (
      <>
        {/* Placeholders cuando no hay imágenes */}
        <div className="absolute h-[255px] left-[27px] md:left-[144px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sin imágenes</span>
        </div>
        <div className="absolute h-[255px] left-[307px] md:left-[419px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sin imágenes</span>
        </div>
        <div className="absolute h-[255px] left-[587px] md:left-[694px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sin imágenes</span>
        </div>
        <div className="absolute h-[255px] left-[867px] md:left-[969px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sin imágenes</span>
        </div>
      </>
    );
  }

  const visibleImages = getVisibleImages();
  // Posiciones ajustadas para estar dentro del cuadro blanco (que empieza en left-24 = 96px)
  // Padding interior del cuadro: 48px
  // Total offset: 96 + 48 = 144px desde el borde del contenedor
  // 4 imágenes de 255px + 3 gaps de 20px = 1080px
  const positions = [
    "absolute h-[255px] left-[27px] md:left-[144px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto",
    "absolute h-[255px] left-[307px] md:left-[419px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto",
    "absolute h-[255px] left-[587px] md:left-[694px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto",
    "absolute h-[255px] left-[867px] md:left-[969px] rounded-[20px] top-[390px] w-[255px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
  ];

  return (
    <>
      {positions.map((position, index) => {
        const image = visibleImages[index];
        return (
          <div key={`gallery-${index}`} className={position}>
            {image ? (
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover rounded-[20px]"
                sizes="(max-width: 768px) 100vw, 255px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-[20px] flex items-center justify-center">
                <span className="text-gray-500 text-sm">Galería {index + 1}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Controles de navegación del carrusel */}
      {images.length > 4 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-4 flex gap-4 items-center z-10">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-zinc-300 bg-white flex items-center justify-center hover:bg-zinc-50 transition-colors shadow-md"
            aria-label="Anterior"
          >
            <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.646446 3.64645C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646446 3.64645ZM19 4V3.5L1 3.5V4V4.5L19 4.5V4Z" fill="#9A9A9A"/>
            </svg>
          </button>
          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
            {currentIndex + 1} / {Math.ceil(images.length / 4)}
          </span>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-zinc-300 bg-white flex items-center justify-center hover:bg-zinc-50 transition-colors shadow-md"
            aria-label="Siguiente"
          >
            <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3536 4.35355C18.5488 4.15829 18.5488 3.84171 18.3536 3.64645L15.1716 0.464467C14.9763 0.269205 14.6597 0.269205 14.4645 0.464467C14.2692 0.65973 14.2692 0.976312 14.4645 1.17157L17.2929 4L14.4645 6.82843C14.2692 7.02369 14.2692 7.34027 14.4645 7.53554C14.6597 7.7308 14.9763 7.7308 15.1716 7.53554L18.3536 4.35355ZM0 4L-4.37114e-08 4.5L18 4.5L18 4L18 3.5L4.37114e-08 3.5L0 4Z" fill="#9A9A9A"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
