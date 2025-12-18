'use client'

import { useState } from 'react'
import { createB2BRequest } from '@/app/actions/b2b'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface B2BMarketTabProps {
    cars: any[]
}

export function B2BMarketTab({ cars }: B2BMarketTabProps) {
    const { toast } = useToast()
    const [requesting, setRequesting] = useState<number | null>(null)

    const handleRequest = async (carId: number) => {
        setRequesting(carId)
        try {
            await createB2BRequest(carId)
            toast({
                title: "Solicitud enviada",
                description: "El propietario ha recibido tu interés.",
                className: "bg-green-600 text-white border-none"
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "No se pudo enviar la solicitud",
                variant: "destructive"
            })
        } finally {
            setRequesting(null)
        }
    }
    if (cars.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No hay vehículos disponibles en el mercado B2B actualmente.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {cars.map((car) => (
                <div key={car.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 sm:aspect-none h-48 relative">
                        {car.images?.[0]?.url ? (
                            <img src={car.images[0].url} alt={car.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin Foto</div>
                        )}
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                            B2B
                        </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {car.make?.name} {car.model?.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{car.version}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500 gap-2">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span>{car.year}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">speed</span>{car.kms.toLocaleString()} km</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_gas_station</span>{car.fuel}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Precio Cliente</p>
                                    <p className="text-sm font-medium text-gray-500 line-through decoration-red-400">
                                        {car.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-700 font-bold mb-0.5">Precio Profesional</p>
                                    <p className="text-xl font-extrabold text-[#93c01f]">
                                        {car.b2bPrice?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }) || 'Consultar'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRequest(car.id)}
                                disabled={requesting === car.id}
                                className="mt-4 w-full bg-[#0C689a] text-white py-2 px-4 rounded-md hover:bg-[#0a5680] text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {requesting === car.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Solicitar / Reservar"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
