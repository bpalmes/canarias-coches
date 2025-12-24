'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { updateCarFinancingMode, calculateBulkInventoryFinancing, calculateSingleCarFinancing } from "@/actions/financing-management"
import { Loader2, Save, Calculator, Settings } from "lucide-react"
import { FinancingSelectionModal } from "./FinancingSelectionModal"

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

    // Modal State
    const [modalConfig, setModalConfig] = useState<{ carId: number, isSinSeguro: boolean } | null>(null)

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
                // Reload to fetch new structure with formatting options
                window.location.reload()
            } else {
                toast({ variant: "destructive", title: "Aviso", description: res.error })
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message })
        } finally {
            setCalculatingId(null)
        }
    }

    const getRankColor = (car: any, isSinSeguro: boolean) => {
        const opt = car.financingOptions?.find((o: any) => o.isSinSeguro === isSinSeguro)
        const profitRank = opt?.profitRank

        if (!profitRank) return null // No rank available

        // Rank 1 = Green, 1-5 Emerald, 5-10 Amber, else Rose
        let colorClass = 'bg-rose-500 text-white shadow-rose-200'
        if (profitRank === 1) colorClass = 'bg-emerald-500 text-white shadow-emerald-200'
        else if (profitRank <= 5) colorClass = 'bg-emerald-400 text-white shadow-emerald-200'
        else if (profitRank <= 10) colorClass = 'bg-amber-400 text-white shadow-amber-200'

        return (
            <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shadow-sm ${colorClass} ml-2`}>
                {profitRank}
            </div>
        )
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
                        <Calculator className="mx-auto h-12 w-12" />
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
                                            {enabledEntities.map(e => {
                                                let shortName = e.name
                                                if (shortName.includes('Cetelem')) shortName = 'Cetelem'
                                                else if (shortName.includes('BBVA')) shortName = 'BBVA'
                                                else if (shortName.includes('Santander')) shortName = 'Santander'
                                                else if (shortName.includes('Caixa')) shortName = 'Caixa'
                                                else if (shortName.includes('Confia')) shortName = 'Confia'

                                                return (
                                                    <span key={e.id} className="bg-blue-100 text-blue-800 px-1 rounded">{shortName}</span>
                                                )
                                            })}
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
                                                    {r.name}
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
                                            <div className="flex flex-col gap-1">
                                                {/* With Insurance Row */}
                                                {permissions.enableWithInsurance && (
                                                    <div className="flex items-center gap-2">
                                                        {getRankColor(car, false)}
                                                        <span className="text-indigo-600 font-bold">
                                                            S: {car.financeMinInstallment ? car.financeMinInstallment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '-'}
                                                        </span>
                                                        <button
                                                            onClick={() => setModalConfig({ carId: car.id, isSinSeguro: false })}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                                {/* Without Insurance Row */}
                                                {permissions.enableWithoutInsurance && (
                                                    <div className="flex items-center gap-2">
                                                        {getRankColor(car, true)}
                                                        <span className="text-gray-600">
                                                            NS: {car.financeMinInstallmentSS ? car.financeMinInstallmentSS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '-'}
                                                        </span>
                                                        <button
                                                            onClick={() => setModalConfig({ carId: car.id, isSinSeguro: true })}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                        <div className="flex gap-2 justify-end">
                                            {permissions.enableWithInsurance && (
                                                <button
                                                    onClick={() => handleCalculateSingle(car.id, true)}
                                                    disabled={calculatingId === car.id}
                                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded text-xs flex items-center border border-indigo-200"
                                                    title="Calcular (S)"
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
                                                    title="Calcular (NS)"
                                                >
                                                    {calculatingId === car.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Calculator className="h-3 w-3 mr-1" />}
                                                    NS
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalConfig && (
                <FinancingSelectionModal
                    isOpen={!!modalConfig}
                    onClose={() => setModalConfig(null)}
                    carId={modalConfig.carId}
                    isSinSeguro={modalConfig.isSinSeguro}
                    onUpdate={() => window.location.reload()}
                />
            )}
        </div>
    )
}
