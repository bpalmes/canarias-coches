"use client";
import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Car as CarType, CarImage } from '@/utils/types';
import './CarStack.css';
import Link from 'next/link';

type CarWithImages = CarType & { images: CarImage[] };

const CARD_X_OFFSET = 12;
const MAX_VISIBLE_CARDS = 4;

export default function CarStack({ cars: initialCars }: { cars: CarWithImages[] }) {
    const [cars, setCars] = useState<CarWithImages[]>(initialCars);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -60) {
            setCars(prev => {
                const newArr = [...prev];
                const first = newArr.shift();
                if (!first) return prev;
                newArr.push(first);
                return newArr;
            });
        }
    };
    
    if (!cars || cars.length === 0) {
        return <div className="text-center text-gray-500">No hay coches destacados para mostrar.</div>;
    }
  
    return (
        <div className="stack-container">
            {cars.slice(0, MAX_VISIBLE_CARDS).map((car, index) => {
                
                const isTopCard = index === 0;
                const cardDisplayIndex = initialCars.findIndex(c => c.id === car.id) + 1;

                return (
                    <motion.div
                        key={car.id}
                        className="card-wrapper"
                        drag={isTopCard ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        animate={{
                            x: index * CARD_X_OFFSET,
                            zIndex: MAX_VISIBLE_CARDS - index,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    >
                        <div 
                            className="card-content overflow-hidden"
                            style={{
                                backgroundColor: 'white',
                                boxShadow: isTopCard ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
                            }}
                        >
                            <div className="w-full h-full p-8 flex flex-col md:flex-row items-center gap-8">
                                {/* Left: Image */}
                                <div className="w-full md:w-1/2 h-64 md:h-full relative">
                                    <Image
                                        src={car.images[0]?.url || '/placeholder.svg'}
                                        alt={car.name}
                                        layout="fill"
                                        className="object-contain"
                                        priority={isTopCard}
                                    />
                                </div>
                    
                                {/* Right: Content */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-black">
                                    <p className="text-xs font-bold uppercase tracking-widest text-purple-500">
                                        {car.bodytype || 'Berlina'}
                                    </p>
                                    <h3 className="text-3xl font-bold mt-2">{car.name.toUpperCase()}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{car.version}</p>
                                    
                                    {/* Pricing */}
                                    <div className="my-4">
                                        {car.financedPrice && (
                                            <p className="text-4xl font-bold text-black">
                                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(car.financedPrice)}
                                            </p>
                                        )}
                                        {car.monthlyFinancingFee && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                o desde <span className="font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(car.monthlyFinancingFee)}/mes</span>
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="my-4 flex items-center gap-2 flex-wrap">
                                        <span className="border border-gray-300 rounded-full px-3 py-1 text-xs">{car.fuel}</span>
                                        <span className="border border-gray-300 rounded-full px-3 py-1 text-xs">{new Intl.NumberFormat('es-ES').format(car.kms)} km</span>
                                        <span className="border border-gray-300 rounded-full px-3 py-1 text-xs">{car.year}</span>
                                    </div>
                    
                                    <p className="text-xs text-gray-600 leading-relaxed mb-6">
                                        {(car.description && car.description.length > 120) ? `${car.description.substring(0, 120)}...` : car.description || 'Descubre más sobre este increíble coche.'}
                                    </p>
                                    
                                    <Link href={`/car/${car.id}`} className="flex items-center gap-3 font-semibold text-black group text-sm">
                                        <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-opacity-80 transition-colors">
                                            <ArrowRight className="h-4 w-4"/>
                                        </span>
                                        Explorar
                                    </Link>
                                </div>
                            </div>

                            {/* Card Number */}
                            <div 
                                className="absolute right-8 bottom-8 text-9xl font-bold text-black/10"
                                style={{ zIndex: 1 }}
                            >
                                {cardDisplayIndex}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
      </div>
    );
}