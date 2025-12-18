import Link from 'next/link'
import { Car, Make, Model, Image as CarImage } from '@prisma/client'

// Extended type to include relations
type CarWithRelations = Car & {
    make: Make
    model: Model
    images: CarImage[]
}

export function CarCard({ car }: { car: CarWithRelations }) {
    const mainImage = car.images[0]?.url || 'https://placehold.co/600x400?text=No+Image'

    return (
        <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                    src={mainImage}
                    alt={car.name || `${car.make.name} ${car.model.name}`}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/inventory/${car.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {car.name || `${car.make.name} ${car.model.name}`}
                    </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{car.version}</p>
                <div className="mt-4 flex flex-1 items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">{car.year} | {car.kms.toLocaleString()} km</span>
                        <span className="text-lg font-bold text-gray-900">{car.price.toLocaleString('es-ES')} €</span>
                    </div>
                    {car.financedPrice && (
                        <div className="text-right">
                            <span className="text-xs text-blue-600 font-medium">Desde</span>
                            <div className="text-sm font-bold text-blue-600">
                                {car.monthlyFinancingFee ? `${car.monthlyFinancingFee}€/mes` : 'Consultar'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
