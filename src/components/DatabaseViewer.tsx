"use client";
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link as LinkIcon, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Car as CarType } from '@prisma/client';
import { CarImage } from '@/utils/types';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CarWithImages extends CarType {
  images: CarImage[];
  source: string;
}


export default function DatabaseViewer({ refreshKey }: { refreshKey?: number }) {
  const [cars, setCars] = useState<CarWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) throw new Error('Authentication token not found.');

        const response = await fetch('/api/cars', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch car data.');
        }

        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [refreshKey]);

  const filteredCars = cars.filter(car =>
    car.numberplate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2">Cargando datos de coches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Card className="mt-12">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Visor de la Base de Datos de Coches</CardTitle>
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar por matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {`Mostrando ${filteredCars.length} de ${cars.length} coches.`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Origen</TableHead>
              <TableHead className="text-center">Imágenes</TableHead>
              <TableHead className="text-right">Ver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.map((car) => (
              <TableRow key={car.id} className={car.isSold ? 'opacity-60 bg-gray-50' : ''}>
                <TableCell className="font-mono text-xs">{car.numberplate || 'N/A'}</TableCell>
                <TableCell className="font-medium">
                  {car.name}
                  {car.isSold && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      VENDIDO
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(car.regularPrice)}
                </TableCell>
                <TableCell className="text-center">
                  {car.isSold ? (
                    <Badge variant="destructive" className="text-xs">Vendido</Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">Disponible</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={car.source === 'feed' ? 'default' : 'secondary'} className="text-xs">
                    {car.source === 'feed' ? 'Feed' : 'Manual'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{car.images?.length || 0}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/car/${car.id}`} target="_blank">
                            <LinkIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 