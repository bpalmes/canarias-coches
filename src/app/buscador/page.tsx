import OffersClientPart from '@/components/OffersClientPart';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { Suspense } from 'react';

export default async function BuscadorPage() {

  const words = [
    {
      text: "Encuentra",
    },
    {
      text: "el",
    },
    {
      text: "coche",
    },
    {
      text: "de",
    },
    {
      text: "tus",
    },
    {
      text: "sueños",
    },
    {
      text: "en",
    },
    {
      text: "Miguel",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "León.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-[20rem] bg-white dark:bg-black">
        <p className="text-neutral-600 dark:text-neutral-200 text-base mb-5">
          Tu próximo coche te está esperando
        </p>
        <TypewriterEffectSmooth words={words} />
      </div>
      <Suspense fallback={
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <OffersClientPart />
      </Suspense>
    </div>
  );
}

