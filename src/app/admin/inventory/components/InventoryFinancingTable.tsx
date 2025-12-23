'use client'

import { useState } from 'react'
import { calculateBulkInventoryFinancing } from "@/actions/financing-management"
import Image from "next/image"

export default function InventoryFinancingTable({ cars: initialCars, dealershipId }: { cars: any[], dealershipId: number }) {
    const [cars, setCars] = useState(initialCars)
    const [isCalculating, setIsCalculating] = useState(false)

    const handleCalculateAll = async () => {
        setIsCalculating(true)
        try {
            const result = await calculateBulkInventoryFinancing(dealershipId)
            if (result.success && result.updatedCars) {
                // Refresh local data (simple reload or merging state)
                window.location.reload()
            }
        } catch (error) {
            console.error("Calculation failed", error)
            alert("Error calculating financing.")
        } finally {
            setIsCalculating(false)
        }
    }

    return (
        <div className="mt-8">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCalculateAll}
                    disabled={isCalculating}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {isCalculating ? 'Calculando...' : 'Calcular Financ. Todo el Inventario'}
                </button>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Vehículo</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Precio</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cuota Mín. (Calculada)</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cuota Sin Seguro (Calculada)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {car.images?.[0]?.url ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={car.images[0].url} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">
                                                {car.make?.name} {car.model?.name}
                                            </div>
                                            <div className="text-gray-500">{car.version}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {car.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-indigo-600">
                                    {car.financeMinInstallment
                                        ? car.financeMinInstallment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                                        : '-'
                                    }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {car.financeMinInstallmentSS
                                        ? car.financeMinInstallmentSS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                                        : '-'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
