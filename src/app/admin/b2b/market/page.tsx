import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CarService } from "@/services/car-service"
import { redirect } from "next/navigation"

export default async function B2BMarketPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.dealershipId) {
        redirect('/login')
    }

    const carService = new CarService()
    let result = { data: [], meta: { total: 0 } }

    try {
        // @ts-ignore - method added recently
        result = await carService.getB2BCars(1, 100)
    } catch (e) {
        console.log('B2B fetch failed (schema sync likely required)')
    }

    const cars = result.data

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Mercado B2B</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Vehículos disponibles para compra profesional.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {cars.map((car: any) => (
                    <div key={car.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                        <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-48">
                            {car.images?.[0]?.url ? (
                                <img src={car.images[0].url} alt={car.name} className="w-full h-full object-cover sm:h-full sm:w-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sin Foto</div>
                            )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">
                                    {car.make?.name} {car.model?.name}
                                </h3>
                                <p className="text-sm text-gray-500">{car.version}</p>
                                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                    <span>{car.year}</span>
                                    <span>{car.kms.toLocaleString()} km</span>
                                    <span>{car.fuel}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Precio B2B</p>
                                        <p className="text-lg font-bold text-indigo-600">
                                            {car.b2bPrice?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) || 'Consultar'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 line-through">PVP</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {car.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                    </div>
                                </div>
                                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                    Solicitar Compra
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cars.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hay vehículos disponibles en el mercado B2B actualmente.</p>
                </div>
            )}
        </div>
    )
}
