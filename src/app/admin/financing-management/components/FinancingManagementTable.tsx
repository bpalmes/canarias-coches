'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FinancingConfigModal from './FinancingConfigModal'

export default function FinancingManagementTable({
    initialData,
    allEntities,
    allInterestRates
}: {
    initialData: any[],
    allEntities: any[],
    allInterestRates: any[]
}) {
    const router = useRouter()
    const [dealerships, setDealerships] = useState(initialData)
    const [selectedDealership, setSelectedDealership] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Sync state with props on re-render
    useEffect(() => {
        setDealerships(initialData)
    }, [initialData])

    const handleEdit = (dealership: any) => {
        setSelectedDealership(dealership)
        setIsModalOpen(true)
    }

    const handleModalUpdate = () => {
        router.refresh()
        setIsModalOpen(false)
        // No need for window.location.reload() anymore due to useEffect
    }

    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Concesionario</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Estado</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Modelo</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Configuración</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Editar</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {dealerships.map((dealership) => (
                        <tr key={dealership.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        {dealership.logoUrl ? (
                                            <img className="h-10 w-10 rounded-full object-cover" src={dealership.logoUrl} alt="" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-gray-900">{dealership.name}</div>
                                        <div className="text-gray-500">{dealership.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${dealership.financingEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {dealership.financingEnabled ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${dealership.usePlatformFinancing ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {dealership.usePlatformFinancing ? 'Génesis' : 'Privada'}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <div className="flex flex-col gap-1 text-xs">
                                    <span>{dealership.enabledFinancialEntities?.length || 0} Entidades</span>
                                    <span>{dealership.enabledInterestRates?.length || 0} Tipos Interés</span>
                                </div>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                    onClick={() => handleEdit(dealership)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Configurar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedDealership && (
                <FinancingConfigModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    dealership={selectedDealership}
                    allEntities={allEntities}
                    allInterestRates={allInterestRates}
                    onUpdate={handleModalUpdate}
                />
            )}
        </div>
    )
}
