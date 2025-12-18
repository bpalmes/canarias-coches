import { CarService } from '@/services/car-service'
import { CarCard } from './components/CarCard'

// Force dynamic rendering as inventory changes frequently
export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
    const carService = new CarService()
    const { data: cars } = await carService.getAll()

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nuestro Inventario</h2>
                    <span className="text-sm text-gray-500">{cars.length} vehículos disponibles</span>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {cars.map((car) => (
                        // @ts-ignore - Relations are included but TS might handle extended types strictly
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>

                {cars.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No hay vehículos disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
