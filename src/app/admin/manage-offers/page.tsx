"use client";
import { useState, useEffect, useReducer } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Search, X, CheckCircle, AlertTriangle, Link as LinkIcon, Trash2 } from 'lucide-react';
import { getToken } from '@/utils/auth';
import { Car, Offer } from '@/utils/types';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

// Offers now have a _count property from the backend query
type OfferWithCount = Offer & {
  _count: {
    cars: number;
  };
};

export default function ManageOffersPage() {
  const [offerTitle, setOfferTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  
  // Campos de títulos personalizados (Figma style)
  const [offerTitleCustom, setOfferTitleCustom] = useState('');
  const [offerSubtitleCustom, setOfferSubtitleCustom] = useState('');
  
  // Campos de imágenes de la oferta
  const [innerImageUrl, setInnerImageUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'link'; url?: string } | null>(null);

  const [offers, setOffers] = useState<OfferWithCount[]>([]);
  const [isOffersLoading, setIsOffersLoading] = useState(true);
  const [reducer, forceUpdate] = useReducer(x => x + 1, 0);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsOffersLoading(true);
      try {
        const token = getToken();
        const response = await fetch('/api/offers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar ofertas');
        const data: OfferWithCount[] = await response.json();
        setOffers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsOffersLoading(false);
      }
    };
    fetchOffers();
  }, [reducer]);


  useEffect(() => {
    const searchCars = async (term: string) => {
        if (term.length < 2) {
          setSearchResults([]);
          return;
        }
        setIsSearching(true);
        try {
          const token = getToken();
          const response = await fetch(`/api/cars/search?term=${term}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Error al buscar coches');
          const data: Car[] = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error(error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
    }

    searchCars(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  const handleSelectCar = (car: Car) => {
    // Defensively prevent adding duplicates
    setSelectedCars(prev => {
        if (prev.find(c => c.id === car.id)) {
            return prev;
        }
        return [...prev, car];
    });
  };

  const handleRemoveCar = (carId: number) => {
    setSelectedCars(prev => prev.filter(c => c.id !== carId));
  };

  const handleCreateOffer = async () => {
    if (!offerTitle || selectedCars.length === 0) {
      setFeedback({ message: 'El título de la oferta y al menos un coche son obligatorios.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setFeedback(null);
    try {
      const token = getToken();
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title: offerTitle, 
          cars: selectedCars.map(c => c.id),
          offerTitle: offerTitleCustom || null,
          offerSubtitle: offerSubtitleCustom || null,
          innerImageUrl: innerImageUrl,
          coverImageUrl: coverImageUrl
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo crear la oferta.');
      
      const offerUrl = `/ofertas/${result.slug}`;
      setFeedback({ message: `¡Oferta creada con éxito!`, type: 'link', url: offerUrl });
      
      // Reset form
      setOfferTitle('');
      setSelectedCars([]);
      setSearchTerm('');
      setSearchResults([]);
      setOfferTitleCustom('');
      setOfferSubtitleCustom('');
      setInnerImageUrl(null);
      setCoverImageUrl(null);
      forceUpdate(); // Re-fetch offers
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
      setFeedback({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.')) {
        return;
    }
    try {
        const token = getToken();
        const response = await fetch(`/api/offers/${offerId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'No se pudo eliminar la oferta');
        }
        forceUpdate(); // Re-fetch offers
    } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  const availableCarsToSelect = searchResults.filter(
    (car) => !selectedCars.some((selected) => selected.id === car.id)
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crear Nueva Oferta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="offer-title" className="block text-sm font-medium text-gray-700 mb-1">Título de la Oferta</label>
              <Input
                id="offer-title"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                placeholder="Ej: Ofertas de Verano"
                disabled={isLoading}
              />
            </div>

            {/* Sección Títulos Personalizados */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Títulos Personalizados</h3>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Título Principal
                </Label>
                <Input
                  value={offerTitleCustom}
                  onChange={(e) => setOfferTitleCustom(e.target.value)}
                  placeholder="Ej: Aprovecha las últimas cinco Citroën C3"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa fuente Poppins - Texto grande y destacado
                </p>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </Label>
                <Input
                  value={offerSubtitleCustom}
                  onChange={(e) => setOfferSubtitleCustom(e.target.value)}
                  placeholder="Ej: Vehículos seleccionados con descuentos increíbles"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa fuente Lato - Texto más pequeño
                </p>
              </div>
            </div>

            {/* Sección Imágenes de la Oferta */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Imágenes de la Oferta</h3>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen Interior Grande (Hero)
                </Label>
                <ImageUpload
                  value={innerImageUrl || ''}
                  onChange={(url) => setInnerImageUrl(url)}
                  accept="image/*"
                  maxSize={5}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagen grande que aparece en la página de la oferta (relación aspecto 31:1 aprox.)
                </p>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen Exterior Cuadrada (Home)
                </Label>
                <ImageUpload
                  value={coverImageUrl || ''}
                  onChange={(url) => setCoverImageUrl(url)}
                  accept="image/*"
                  maxSize={5}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagen cuadrada que aparecerá en la página principal (home)
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="car-search" className="block text-sm font-medium text-gray-700 mb-1">Buscar Coches para Añadir</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="car-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o matrícula..."
                  className="pl-10"
                  disabled={isLoading}
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
              </div>
              <div className="mt-2 max-h-60 overflow-y-auto border rounded-md">
                {availableCarsToSelect.length > 0 ? (
                  <ul className="divide-y">
                    {availableCarsToSelect.map(car => (
                      <li key={car.id} onClick={() => handleSelectCar(car)} className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
                        <div className="h-12 w-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          {car.images && car.images.length > 0 && car.images[0]?.url ? (
                            <img 
                              src={car.images[0].url} 
                              alt={car.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`text-xs text-gray-500 text-center ${car.images && car.images.length > 0 ? 'hidden' : ''}`}>
                            Sin foto
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{car.name}</p>
                          <p className="text-xs text-gray-500">{car.numberplate || 'Sin matrícula'}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isSearching && searchTerm && <p className="p-4 text-sm text-gray-500 text-center">No se encontraron coches.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
              {feedback && (
                   <div className={`p-2 rounded-md text-sm flex items-center space-x-2 ${
                    feedback.type === 'success' || feedback.type === 'link' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                    }`}>
                    {feedback.type === 'error' ? <AlertTriangle className="h-4 w-4"/> : <CheckCircle className="h-4 w-4"/>}
                    <span>{feedback.message}</span>
                    {feedback.type === 'link' && feedback.url && (
                        <a href={feedback.url} target="_blank" rel="noopener noreferrer" className="ml-2 font-bold underline hover:text-green-700 flex items-center gap-1">
                            Ver Oferta <LinkIcon className="h-4 w-4"/>
                        </a>
                    )}
                   </div>
              )}
              <div className="flex-grow" />
              <Button onClick={handleCreateOffer} disabled={isLoading || !offerTitle || selectedCars.length === 0}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Oferta
              </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coches Seleccionados ({selectedCars.length})</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[30rem] overflow-y-auto">
            {selectedCars.length > 0 ? (
              <ul className="space-y-3">
                {selectedCars.map(car => (
                  <li key={car.id} className="p-2 rounded-md border flex items-center space-x-3">
                    <div className="h-9 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      {car.images && car.images.length > 0 && car.images[0]?.url ? (
                        <img 
                          src={car.images[0].url} 
                          alt={car.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`text-xs text-gray-400 text-center ${car.images && car.images.length > 0 ? 'hidden' : ''}`}>
                        Sin foto
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{car.name}</p>
                      <p className="text-xs text-gray-500">{car.numberplate || 'Sin matrícula'}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCar(car.id)} disabled={isLoading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                  <p>Busca y selecciona coches para añadirlos a la oferta.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Ofertas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
            {isOffersLoading ? (
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <Table>
                    <TableCaption>
                        {offers.length > 0 ? `Un total de ${offers.length} ofertas.` : 'No hay ofertas creadas.'}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título de la Oferta</TableHead>
                            <TableHead className="text-center">Nº Coches</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell className="font-medium">{offer.title}</TableCell>
                                <TableCell className="text-center">{offer._count.cars}</TableCell>
                                <TableCell>{new Date(offer.createdAt).toLocaleDateString('es-ES')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/manage-offers/${offer.id}`}>
                                            Gestionar
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={`/ofertas/${offer.slug}`} target="_blank" rel="noopener noreferrer">
                                            Ver <LinkIcon className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteOffer(offer.id)}>
                                        Eliminar <Trash2 className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
} 