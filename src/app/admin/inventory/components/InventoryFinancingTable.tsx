'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { updateCarFinancingMode, calculateBulkInventoryFinancing, calculateSingleCarFinancing } from "@/actions/financing-management"
import { Loader2, Save, Calculator } from "lucide-react"

interface InventoryFinancingTableProps {
    cars: any[]
    dealershipId: number
    permissions: {
        enableWithInsurance: boolean
        enableWithoutInsurance: boolean
    }
    enabledEntities: { id: number, name: string, code: string }[]
    enabledRates: { id: number, name: string, value: number }[]
}

export default function InventoryFinancingTable({ cars: initialCars, dealershipId, permissions, enabledEntities = [], enabledRates = [] }: InventoryFinancingTableProps) {
    const { toast } = useToast()
    const [cars, setCars] = useState(initialCars)
    const [calculatingId, setCalculatingId] = useState<number | null>(null)
    const [isBulkCalculating, setIsBulkCalculating] = useState(false)
    const [savingId, setSavingId] = useState<number | null>(null)

    const handleTogglePlatform = async (carId: number, usePlatform: boolean) => {
        setSavingId(carId)
        // Optimistic update
        setCars(prev => prev.map(c => c.id === carId ? { ...c, usePlatformFinancing: usePlatform } : c))

        try {
            const car = cars.find(c => c.id === carId)
            const currentManual = car?.monthlyFinancingFee || 0
            await updateCarFinancingMode(carId, usePlatform, currentManual)
            toast({ title: "Modo actualizado", description: usePlatform ? "Usando financiación Genesis" : "Usando cuota manual" })
        } catch (error) {
            console.error(error)
            setCars(prev => prev.map(c => c.id === carId ? { ...c, usePlatformFinancing: !usePlatform } : c))
            toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el modo" })
        } finally {
            setSavingId(null)
        }
    }

    const handleSaveQuota = async (car: any) => {
        setSavingId(car.id)
        try {
            await updateCarFinancingMode(car.id, false, car.monthlyFinancingFee)
            toast({ title: "Cuota guardada", description: "El valor manual se ha guardado." })
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la cuota" })
        } finally {
            setSavingId(null)
        }
    }

    const handleManualQuotaChange = (carId: number, value: number) => {
        setCars(prev => prev.map(c => c.id === carId ? { ...c, monthlyFinancingFee: value } : c))
    }

    const handleCalculateAll = async (withInsurance: boolean) => {
        setIsBulkCalculating(true)
        try {
            const res = await calculateBulkInventoryFinancing(dealershipId, withInsurance)
            toast({ title: "Cálculo masivo completado", description: `Se actualizaron ${res.updatedCars} vehículos.` })
            // Soft refresh or let revalidatePath handle it. 
            // Since we have local state 'cars', we might strictly need to refresh.
            // Ideally we should start using router.refresh() but window.location.reload() is safer for now to sync with server.
            window.location.reload()
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        } finally {
            setIsBulkCalculating(false)
        }
    }

    const handleCalculateSingle = async (carId: number, withInsurance: boolean) => {
        setCalculatingId(carId)
        try {
            const res = await calculateSingleCarFinancing(carId, withInsurance)
            if (res.success) {
                toast({ title: "Cálculado", description: `Cuota: ${res.value?.toFixed(2)}€ ${res.debug || ''}` })
                // Update local state to show result immediately
                setCars(prev => prev.map(c => {
                    if (c.id !== carId) return c
                    return {
                        ...c,
                        financeMinInstallment: withInsurance ? res.value : c.financeMinInstallment,
                        financeMinInstallmentSS: !withInsurance ? res.value : c.financeMinInstallmentSS
                    }
                }))
            } else {
                toast({ variant: "destructive", title: "Aviso", description: res.error })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        } finally {
            setCalculatingId(null)
        }
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 font-medium">
                    Vehículos habilitados: {cars.length}
                </span>
                <div className="flex gap-3">
                    {permissions.enableWithInsurance && (
                        <button
                            onClick={() => handleCalculateAll(true)}
                            disabled={isBulkCalculating}
                            className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 ${isBulkCalculating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {isBulkCalculating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            {isBulkCalculating ? 'Calculando...' : 'Calcular Todo (Con Seguro)'}
                        </button>
                    )}

                    {permissions.enableWithoutInsurance && (
                        <button
                            onClick={() => handleCalculateAll(false)}
                            disabled={isBulkCalculating}
                            className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 ${isBulkCalculating ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'}`}
                        >
                            {isBulkCalculating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            {isBulkCalculating ? 'Calculando...' : 'Calcular Todo (Sin Seguro)'}
                        </button>
                    )}
                </div>
            </div>

            {cars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay vehículos</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron vehículos para calcular financiación.</p>
                </div>
            ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Vehículo</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Configuración</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipos Interés</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Precio</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Financiación Genesis</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cuota (Display)</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acciones (Debug)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {cars.map((car) => (
                                <tr key={car.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="font-medium text-gray-900">{car.make?.name} {car.model?.name}</div>
                                        <div className="text-gray-500">{car.version} (Ref: {car.sku})</div>
                                    </td>
                                    <td className="px-3 py-4 text-xs text-gray-500 max-w-[200px]">
                                        <div className="flex flex-wrap gap-1">
                                            {enabledEntities.map(e => (
                                                <span key={e.id} className="bg-blue-100 text-blue-800 px-1 rounded">{e.name}</span>
                                            ))}
                                            {enabledEntities.length === 0 && <span className="text-red-500">Sin entidades</span>}
                                        </div>
                                        <div className="mt-1 flex gap-2 font-semibold">
                                            <span className={permissions.enableWithInsurance ? "text-green-600" : "text-gray-300"}>Seg: ON</span>
                                            <span className={permissions.enableWithoutInsurance ? "text-green-600" : "text-gray-300"}>Sin: ON</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-xs text-gray-500 max-w-[150px]">
                                        <div className="flex flex-wrap gap-1">
                                            {enabledRates.length > 0 ? enabledRates.map(r => (
                                                <span key={r.id} className="bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded border border-orange-100">
                                                    {r.name} ({Number(r.value).toFixed(2)}%)
                                                </span>
                                            )) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {car.price?.toLocaleString()} €
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={car.usePlatformFinancing}
                                                onCheckedChange={(checked) => handleTogglePlatform(car.id, checked)}
                                                disabled={savingId === car.id}
                                            />
                                            <span className="text-xs">{car.usePlatformFinancing ? 'Automático' : 'Manual'}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                        {car.usePlatformFinancing ? (
                                            <span className="text-indigo-600">
                                                {car.financeMinInstallment
                                                    ? car.financeMinInstallment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                                                    : '-'
                                                }
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-24 rounded border-gray-300 p-1 text-sm bg-gray-50"
                                                    value={car.monthlyFinancingFee || ''}
                                                    onChange={(e) => handleManualQuotaChange(car.id, Number(e.target.value))}
                                                    placeholder="0.00"
                                                />
                                                <button
                                                    onClick={() => handleSaveQuota(car)}
                                                    disabled={savingId === car.id}
                                                    className="text-gray-400 hover:text-indigo-600"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex flex-col gap-1 items-end">
                                            <div className="text-xs text-gray-500 flex gap-2">
                                                <span title="Mínimo con seguro">S: {car.financeMinInstallment?.toFixed(0) || '-'}€</span>
                                                <span title="Mínimo sin seguro">NS: {car.financeMinInstallmentSS?.toFixed(0) || '-'}€</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {permissions.enableWithInsurance && (
                                                    <button
                                                        onClick={() => handleCalculateSingle(car.id, true)}
                                                        disabled={calculatingId === car.id}
                                                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded text-xs flex items-center border border-indigo-200"
                                                        title="Calcular solo este coche (Con Seguro)"
                                                    >
                                                        {calculatingId === car.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Calculator className="h-3 w-3 mr-1" />}
                                                        S
                                                    </button>
                                                )}
                                                {permissions.enableWithoutInsurance && (
                                                    <button
                                                        onClick={() => handleCalculateSingle(car.id, false)}
                                                        disabled={calculatingId === car.id}
                                                        className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded text-xs flex items-center border border-gray-200"
                                                        title="Calcular solo este coche (Sin Seguro)"
                                                    >
                                                        {calculatingId === car.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Calculator className="h-3 w-3 mr-1" />}
                                                        NS
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
