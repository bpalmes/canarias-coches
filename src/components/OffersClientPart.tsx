"use client";
import { useState, useEffect } from 'react';
import CarCardCompact from './CarCardCompact';
import { Car, CarFront, Tag, ShoppingCart, MapPin, SlidersHorizontal, Info, Building, Calendar, Gauge } from 'lucide-react';
import { HoverEffect } from './ui/card-hover-effect';
import OffersSkeleton from './OffersSkeleton';
import { Button } from './ui/button';
import { CollapsibleFilterSection } from './ui/CollapsibleFilterSection';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';

interface CarData {
  id: number; name: string; make: string; model: string; version: string;
  year: number | null; kms: number | null; power: number; fuel: string | null;
  transmission: string | null; regularPrice: number; financedPrice: number | null;
  monthlyFinancingFee: number; environmentalBadge: string;
  images: { url: string; isPrimary: boolean }[];
  bodytype?: string;
}

type SortType = 'all' | 'lowest_kms' | 'newest' | 'lowest_fee';
type CarTypeFilter = 'all' | 'occasion' | 'km0' | 'new';

const Checkbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm">
    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
);

export default function OffersClientPart() {
  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialCars, setInitialCars] = useState<CarData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeSort, setActiveSort] = useState<SortType>('all');

  const [filters, setFilters] = useState({
    carType: 'all' as CarTypeFilter,
    makeAndModel: '',
    version: '',
    priceRange: [0, 50000],
    yearRange: [2010, 2024],
    kmsRange: [0, 200000],
    onlineServices: { reserve: false },
    location: { peninsula: false },
    sellers: { certified: false, inStock: false, withPhoto: false },
    bodyType: [] as string[],
    transmission: 'all',
    feeMax: null as number | null,
  });

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Cargar solo los primeros 6 coches inmediatamente
        const response = await fetch('/api/cars?limit=6');
        const initialData = await response.json();
        setInitialCars(initialData);
        setAllCars(initialData);
        setLoading(false);

        // Cargar el resto en segundo plano
        setLoadingMore(true);
        const fullResponse = await fetch('/api/cars');
        const fullData = await fullResponse.json();
        setAllCars(fullData);
        setLoadingMore(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Inicializar filtros desde query params (make, makeAndModel, priceMin, priceMax, feeMax)
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    const make = searchParams.get('make');
    const makeAndModelParam = searchParams.get('makeAndModel');
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const feeMaxParam = searchParams.get('feeMax');

    const next = { ...filters };
    if (makeAndModelParam) {
      next.makeAndModel = makeAndModelParam;
    } else if (make) {
      next.makeAndModel = make;
    }

    const priceMin = priceMinParam ? Number(priceMinParam) : null;
    const priceMax = priceMaxParam ? Number(priceMaxParam) : null;
    if (priceMin !== null || priceMax !== null) {
      next.priceRange = [priceMin ?? 0, priceMax ?? next.priceRange[1]] as [number, number];
    }

    if (feeMaxParam) {
      const fee = Number(feeMaxParam);
      if (!Number.isNaN(fee)) next.feeMax = fee;
    }

    setFilters(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let carsToProcess = [...allCars];

    carsToProcess = carsToProcess.filter(car => {
      const { carType, makeAndModel, version, priceRange, yearRange, kmsRange, bodyType, transmission, feeMax } = debouncedFilters;

      const kms = car.kms ?? 0;
      if (carType !== 'all') {
        if (carType === 'new' && kms !== 0) return false;
        if (carType === 'km0' && (kms <= 0 || kms >= 100)) return false;
        if (carType === 'occasion' && kms < 100) return false;
      }

      if (makeAndModel && !car.name.toLowerCase().includes(makeAndModel.toLowerCase())) return false;
      if (version && !car.version?.toLowerCase().includes(version.toLowerCase())) return false;
      if (car.regularPrice < priceRange[0] || car.regularPrice > priceRange[1]) return false;
      if ((car.year || 0) < yearRange[0] || (car.year || 0) > yearRange[1]) return false;
      if (kms < kmsRange[0] || kms > kmsRange[1]) return false;
      if (bodyType.length > 0 && !bodyType.includes(car.bodytype || '')) return false;
      if (transmission !== 'all' && car.transmission?.toLowerCase() !== transmission) return false;
      if (feeMax !== null && typeof feeMax === 'number') {
        const fee = car.monthlyFinancingFee ?? Infinity;
        if (fee > feeMax) return false;
      }

      return true;
    });

    switch (activeSort) {
      case 'lowest_kms': carsToProcess.sort((a, b) => (a.kms || Infinity) - (b.kms || Infinity)); break;
      case 'newest': carsToProcess.sort((a, b) => (b.year || 0) - (a.year || 0)); break;
      case 'lowest_fee': carsToProcess.sort((a, b) => (a.monthlyFinancingFee || Infinity) - (b.monthlyFinancingFee || Infinity)); break;
    }

    setFilteredCars(carsToProcess);

  }, [debouncedFilters, activeSort, allCars]);

  const handleFilterChange = <K extends keyof typeof filters>(
    filterName: K,
    value: typeof filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleBodyTypeToggle = (type: string) => {
    const newBodyTypes = filters.bodyType.includes(type)
      ? filters.bodyType.filter(t => t !== type)
      : [...filters.bodyType, type];
    handleFilterChange('bodyType', newBodyTypes);
  };

  if (loading) return <OffersSkeleton />;

  const carItems = filteredCars.map(car => ({
    id: car.id,
    link: `/car/${car.id}`,
    children: <CarCardCompact car={car} />
  }));

  const getSortButtonVariant = (sort: SortType) => activeSort === sort ? 'default' : 'outline';

  const getCarTypeButtonVariant = (type: CarTypeFilter) => filters.carType === type ? 'default' : 'outline';

  return (
    <div className="bg-gray-50 min-h-screen"><div className="container mx-auto px-4 py-8"><div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 mb-4">Filtros: se aplican al marcarlos</p>

          <CollapsibleFilterSection title="Tipo de coche" icon={<CarFront className="h-5 w-5" />} defaultOpen>
            <div className="grid grid-cols-2 gap-2"><Button variant={getCarTypeButtonVariant('all')} onClick={() => handleFilterChange('carType', 'all')}>Todos</Button><Button variant={getCarTypeButtonVariant('occasion')} onClick={() => handleFilterChange('carType', 'occasion')}>Ocasión</Button><Button variant={getCarTypeButtonVariant('km0')} onClick={() => handleFilterChange('carType', 'km0')}>Km 0</Button><Button variant={getCarTypeButtonVariant('new')} onClick={() => handleFilterChange('carType', 'new')}>Nuevo</Button></div>
          </CollapsibleFilterSection>

          <CollapsibleFilterSection title="Marca y modelo" icon={<Car className="h-5 w-5" />}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Marca y modelo</label>
                <Input placeholder="Ej: Audi A3" value={filters.makeAndModel} onChange={(e) => handleFilterChange('makeAndModel', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Versión</label>
                <div className="relative mt-1"><Input placeholder="Ejemplo: Elegance, TDI" value={filters.version} onChange={(e) => handleFilterChange('version', e.target.value)} /><Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /></div>
              </div>
            </div>
          </CollapsibleFilterSection>

          <CollapsibleFilterSection title="Precio" icon={<Tag className="h-5 w-5" />}><div className="space-y-4"><Slider value={[filters.priceRange[1]]} onValueChange={(value) => handleFilterChange('priceRange', [0, value[0]])} max={50000} step={1000} /><div className="flex justify-between text-sm"><p>Hasta</p><p>{filters.priceRange[1].toLocaleString()} €</p></div></div></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Año" icon={<Calendar className="h-5 w-5" />}><div className="space-y-4"><Slider value={filters.yearRange} onValueChange={(value) => handleFilterChange('yearRange', value)} min={2010} max={2024} step={1} /><div className="flex justify-between text-sm"><p>{filters.yearRange[0]}</p><p>{filters.yearRange[1]}</p></div></div></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Kilómetros" icon={<Gauge className="h-5 w-5" />}><div className="space-y-4"><Slider value={[filters.kmsRange[1]]} onValueChange={(value) => handleFilterChange('kmsRange', [0, value[0]])} max={200000} step={5000} /><div className="flex justify-between text-sm"><p>Hasta</p><p>{filters.kmsRange[1].toLocaleString()} km</p></div></div></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Servicios online" icon={<ShoppingCart className="h-5 w-5" />}><Checkbox label="Reserva" checked={filters.onlineServices.reserve} onChange={val => handleFilterChange('onlineServices', { ...filters.onlineServices, reserve: val })} /></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Ubicación" icon={<MapPin className="h-5 w-5" />}><Checkbox label="Solo en Península y Baleares" checked={filters.location.peninsula} onChange={val => handleFilterChange('location', { ...filters.location, peninsula: val })} /></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Vendedores" icon={<Building className="h-5 w-5" />}><div className="space-y-2"><Checkbox label="Certificados por la marca" checked={filters.sellers.certified} onChange={val => handleFilterChange('sellers', { ...filters.sellers, certified: val })} /><Checkbox label="En stock" checked={filters.sellers.inStock} onChange={val => handleFilterChange('sellers', { ...filters.sellers, inStock: val })} /><Checkbox label="Solo con foto" checked={filters.sellers.withPhoto} onChange={val => handleFilterChange('sellers', { ...filters.sellers, withPhoto: val })} /></div></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Carrocería" icon={<Car className="h-5 w-5" />}><div className="grid grid-cols-3 gap-2 text-center">{['Berlina', 'Familiar', 'Coupe', 'Monovolumen', 'SUV', 'Cabrio', 'Pick Up'].map(type => <Button key={type} variant={filters.bodyType.includes(type) ? 'default' : 'outline'} onClick={() => handleBodyTypeToggle(type)}>{type}</Button>)}</div></CollapsibleFilterSection>
          <CollapsibleFilterSection title="Motor" icon={<SlidersHorizontal className="h-5 w-5" />}><div className="flex gap-2"><Button variant={filters.transmission === 'all' ? 'default' : 'outline'} onClick={() => handleFilterChange('transmission', 'all')}>Todos</Button><Button variant={filters.transmission === 'automatic' ? 'default' : 'outline'} onClick={() => handleFilterChange('transmission', 'automatic')}>Automático</Button><Button variant={filters.transmission === 'manual' ? 'default' : 'outline'} onClick={() => handleFilterChange('transmission', 'manual')}>Manual</Button></div></CollapsibleFilterSection>
        </div>
      </div>
      <div className="lg:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {filteredCars.length} Coches de km 0 al mejor precio
            {loadingMore && allCars.length > initialCars.length && (
              <span className="text-sm text-gray-500 ml-2">
                (Mostrando {filteredCars.length} de {allCars.length})
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'lowest_fee', 'lowest_kms', 'newest'].map(sort =>
              <Button key={sort} onClick={() => setActiveSort(sort as SortType)} variant={getSortButtonVariant(sort as SortType)} size="sm">
                {{ all: 'Todos', lowest_fee: 'Menos cuota', lowest_kms: 'Menos kilómetros', newest: 'Más nuevos' }[sort]}
              </Button>
            )}
          </div>
        </div>

        <HoverEffect items={carItems} />

        {/* Indicador de carga de más coches */}
        {loadingMore && (
          <div className="mt-8 flex justify-center items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
              <span>Cargando más coches...</span>
            </div>
          </div>
        )}
      </div>
    </div></div></div>
  );
}
