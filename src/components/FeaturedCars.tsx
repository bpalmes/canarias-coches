import { prisma } from "@/lib/prisma";
import CarStack from "./CarStack";
import { Car } from '@/utils/types';
import { Image as PrismaImage } from '@prisma/client';

type CarWithImages = Car & { images: PrismaImage[] };

async function getFeaturedCars(): Promise<CarWithImages[]> {
    // We get the 4 most recently updated cars that have at least one image
    const cars = await prisma.car.findMany({
        where: {
            images: {
                some: {
                    id: {
                        gt: 0,
                    }
                }
            }
        },
        include: {
            images: {
                orderBy: {
                    isPrimary: 'desc'
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: 10
    });
    
    // Transform to match the expected type
    return cars.map(car => ({
        ...car,
        kms: car.kms || 0,
        year: car.year || 0,
        fuel: car.fuel || '',
        bodytype: car.bodytype || '',
    })) as CarWithImages[];
}

export default async function FeaturedCars() {
  const cars = await getFeaturedCars();

  return (
    <section className="bg-gray-100 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-5xl md:text-7xl font-bold" style={{ color: '#0f286a' }}>
            DESTACADOS
          </h2>
          <div className="mt-4 md:flex md:items-baseline md:justify-between">
            <p className="text-lg text-gray-600 max-w-md">
                Estos son solo algunos ejemplos de lo que podemos ofrecer.
            </p>
            <p className="text-lg text-gray-600 max-w-md mt-4 md:mt-0">
                Echa un vistazo y descubre todas las posibilidades.
            </p>
          </div>
        </div>
        
        <div className="relative h-[600px] w-full">
            <CarStack cars={cars} />
        </div>

      </div>
    </section>
  );
} 