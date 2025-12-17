"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Datos estáticos de respaldo
const FALLBACK_MODELS = [
  'FIAT 500', 'Nissan Qashqai', 'BMW X3', 'Audi A4', 'Mercedes-Benz Clase C',
  'Volkswagen Golf', 'Ford Focus', 'Peugeot 308', 'Renault Clio', 'Seat Leon',
  'Kia Sportage', 'Hyundai Tucson', 'Toyota Corolla', 'Honda Civic', 'Mazda CX-5',
  'Opel Astra'
];

const POPULAR_BRANDS = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 'Peugeot', 'Renault', 'FIAT',
  'Nissan', 'Toyota', 'Honda', 'Kia', 'Hyundai', 'Seat', 'Opel', 'Mazda'
];

const FEE_RANGES = [150, 200, 250, 300, 350, 400, 450, 500];

const PRICE_RANGES = [
  { label: 'Hasta 10.000 €', url: '/buscador?priceMax=10000' },
  { label: '10.000 € - 15.000 €', url: '/buscador?priceMin=10000&priceMax=15000' },
  { label: '15.000 € - 20.000 €', url: '/buscador?priceMin=15000&priceMax=20000' },
  { label: '20.000 € - 30.000 €', url: '/buscador?priceMin=20000&priceMax=30000' },
  { label: '30.000 € - 40.000 €', url: '/buscador?priceMin=30000&priceMax=40000' },
  { label: 'Más de 40.000 €', url: '/buscador?priceMin=40000' }
];

export default function QuickSearchSection() {
  const [activeTab, setActiveTab] = useState<'models' | 'brands' | 'fees' | 'prices'>('models');
  const [allModels, setAllModels] = useState<string[]>(FALLBACK_MODELS);
  const [showAllModels, setShowAllModels] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar modelos desde la API
  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        
        if (data.success && data.models.length > 0) {
          setAllModels(data.models);
        }
      } catch (error) {
        console.error('Error cargando modelos:', error);
        // Mantener los datos de respaldo
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  // Mostrar primeros 25 modelos (5x5) o todos
  const modelsToShow = showAllModels ? allModels : allModels.slice(0, 25);

  return (
    <section className="py-4 bg-white">
      <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
        {/* Título */}
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-blue-950 w-full mb-4 max-md:text-xl max-md:text-center">
          Formas de empezar a buscar
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 flex-wrap text-xs mb-2">
          <button onClick={() => setActiveTab('models')} className={activeTab === 'models' ? 'text-blue-700 font-bold' : 'text-neutral-600 font-bold'}>
            Modelos
          </button>
          <button onClick={() => setActiveTab('brands')} className={activeTab === 'brands' ? 'text-blue-700 font-bold' : 'text-neutral-600 font-bold'}>
            Marcas
          </button>
          <button onClick={() => setActiveTab('fees')} className={activeTab === 'fees' ? 'text-blue-700 font-bold' : 'text-neutral-600 font-bold'}>
            Cuotas
          </button>
          <button onClick={() => setActiveTab('prices')} className={activeTab === 'prices' ? 'text-blue-700 font-bold' : 'text-neutral-600 font-bold'}>
            Precios
          </button>
        </div>
        <div className="w-full h-px bg-zinc-200 mb-4"></div>

        {/* Contenido por pestaña */}
        <div>
          {activeTab === 'models' && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="text-gray-500 text-xs">Cargando modelos...</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2 text-xs text-neutral-600">
                    {modelsToShow.map((model, idx) => (
                      <div key={`model-${idx}`} className="leading-6 hover:text-blue-700 transition-colors cursor-pointer">
                        <Link href={`/buscador?makeAndModel=${encodeURIComponent(model)}`}>{model}</Link>
                      </div>
                    ))}
                  </div>
                  
                </>
              )}
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-0 text-xs text-neutral-600">
              {POPULAR_BRANDS.map((brand, idx) => (
                <div key={`brand-${idx}`} className="leading-6 hover:text-blue-700 transition-colors cursor-pointer">
                  <Link href={`/buscador?make=${encodeURIComponent(brand)}`}>{brand}</Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 text-xs text-neutral-600">
              {FEE_RANGES.map((fee) => (
                <div key={`fee-${fee}`} className="leading-6 hover:text-blue-700 transition-colors cursor-pointer">
                  <Link href={`/buscador?feeMax=${fee}`}>{`Hasta ${fee} €/mes`}</Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 text-xs text-neutral-600">
              {PRICE_RANGES.map((range, idx) => (
                <div key={`price-${idx}`} className="leading-6 hover:text-blue-700 transition-colors cursor-pointer">
                  <Link href={range.url}>{range.label}</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA inferior */}
        <div className="mt-4">
          {activeTab === 'models' && allModels.length > 25 && !showAllModels ? (
            <button 
              onClick={() => setShowAllModels(true)}
              className="w-full flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium border px-4 py-2 rounded-full border-zinc-200 bg-transparent text-neutral-600 hover:bg-zinc-50 transition-colors"
            >
              <span className="font-bold">Ver más ({allModels.length - 25} modelos más)</span>
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] transform rotate-90"><path d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM4 0L3.5 -2.18557e-08L3.5 14L4 14L4.5 14L4.5 2.18557e-08L4 0Z" fill="#7D7A7A"/></svg>
            </button>
          ) : activeTab === 'models' && showAllModels ? (
            <button 
              onClick={() => setShowAllModels(false)}
              className="w-full flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium border px-4 py-2 rounded-full border-zinc-200 bg-transparent text-neutral-600 hover:bg-zinc-50 transition-colors"
            >
              <span className="font-bold">Ver menos</span>
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] transform -rotate-90"><path d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM4 0L3.5 -2.18557e-08L3.5 14L4 14L4.5 14L4.5 2.18557e-08L4 0Z" fill="#7D7A7A"/></svg>
            </button>
          ) : (
            <Link href="/buscador" className="w-full flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium border px-4 py-2 rounded-full border-zinc-200 bg-transparent text-neutral-600 hover:bg-zinc-50">
              <span className="font-bold">Ver más</span>
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] transform rotate-90"><path d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM4 0L3.5 -2.18557e-08L3.5 14L4 14L4.5 14L4.5 2.18557e-08L4 0Z" fill="#7D7A7A"/></svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}


