"use client";
import { Car } from '@prisma/client';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

interface OfferCarsManagerProps {
  initialCars: Car[];
  offerId: number;
}

type CarWithImages = Car & { images: { url: string }[] };

export default function OfferCarsManager({ initialCars, offerId }: OfferCarsManagerProps) {
  const [cars, setCars] = useState<CarWithImages[]>(initialCars as CarWithImages[]);
  const router = useRouter();

  const handleToggleSold = async (carId: number, isSold: boolean) => {
    try {
      const token = getToken();
      const response = await fetch(`/api/cars/${carId}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isSold: !isSold }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      setCars(prevCars => prevCars.map(car => car.id === carId ? { ...car, isSold: !isSold } : car));
      router.refresh(); // Re-fetch data on the server
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el estado del coche.');
    }
  };

  const handleRemoveFromOffer = async (carId: number) => {
    if (!confirm('¿Estás seguro de que quieres quitar este coche de la oferta?')) return;
    try {
      const token = getToken();
      const response = await fetch(`/api/cars/${carId}/manage?offerId=${offerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to remove car from offer');
      
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error al quitar el coche de la oferta.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coche</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cars.map((car) => (
            <tr key={car.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <img 
                      className="rounded-full object-cover w-full h-full" 
                      src={car.images[0]?.url || '/placeholder.svg'} 
                      alt={car.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{car.name}</div>
                    <div className="text-sm text-gray-500">{car.make} {car.model}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {car.isSold ? (
                  <Badge variant="destructive">Vendido</Badge>
                ) : (
                  <Badge variant="secondary">Disponible</Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/manage-photos?id=${car.id}`}>
                    <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300">
                      Editar Fotos
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFromOffer(car.id)} className="text-red-600 hover:text-red-900">
                    Eliminar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleToggleSold(car.id, car.isSold)} className="text-green-600 hover:text-green-900">
                    {car.isSold ? 'Marcar como Disponible' : 'Marcar como Vendido'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

