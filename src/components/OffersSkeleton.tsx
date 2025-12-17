export default function OffersSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <div className="h-4 bg-blue-500 rounded animate-pulse"></div>
            <div className="h-4 bg-blue-500 rounded animate-pulse"></div>
            <div className="h-4 bg-blue-500 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Centros skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros skeleton */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-6">
                  <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="lg:w-3/4">
            {/* Barra de ordenación skeleton */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Título skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Grid de coches skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación skeleton */}
            <div className="mt-8 text-center">
              <div className="h-12 bg-gray-200 rounded animate-pulse inline-block w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 