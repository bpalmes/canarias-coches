'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, Check, Banknote, ShieldCheck, ShieldAlert, ArrowUpDown } from "lucide-react"
import { getFinancingOptionsForCar, setSelectedFinancingOption } from "@/actions/financing-management"
import { useToast } from "@/components/ui/use-toast"


interface FinancingSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    carId: number
    isSinSeguro: boolean
    onUpdate: () => void
}

export function FinancingSelectionModal({ isOpen, onClose, carId, isSinSeguro, onUpdate }: FinancingSelectionModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<any[]>([])
    const [selectingId, setSelectingId] = useState<number | null>(null)
    const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' })

    useEffect(() => {
        if (isOpen && carId) {
            setLoading(true)
            getFinancingOptionsForCar(carId, isSinSeguro)
                .then((data) => {
                    setOptions(data)
                })
                .catch((err) => {
                    toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las opciones" })
                })
                .finally(() => setLoading(false))
        }
    }, [isOpen, carId, isSinSeguro])

    const handleSelect = async (optionId: number) => {
        setSelectingId(optionId)
        try {
            await setSelectedFinancingOption(optionId)
            toast({ title: "Opción actualizada", description: "La nueva cuota ahora es la principal." })
            onUpdate() // Refresh parent
            onClose()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar la selección" })
        } finally {
            setSelectingId(null)
        }
    }

    const sortOptions = (data: any[]) => {
        return [...data].sort((a, b) => {
            if (sortConfig.key === 'rank') {
                return sortConfig.direction === 'asc' ? a.rank - b.rank : b.rank - a.rank
            }
            if (sortConfig.key === 'tin') {
                return sortConfig.direction === 'asc' ? a.interestRate - b.interestRate : b.interestRate - a.interestRate
            }
            return 0
        })
    }

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    // Pre-calculate strict Profitability Ranking (1..N) for valid items only
    const profitabilityMap = new Map<number, { rank: number | null, colorClass: string }>()

    // Only rank options that have actual profitability data
    const validProfitOptions = options.filter(o => (o.financialRefValue || 0) > 0)
    const profitSorted = [...validProfitOptions].sort((a, b) => (b.financialRefValue || 0) - (a.financialRefValue || 0))

    const total = profitSorted.length
    const third = Math.ceil(total / 3)

    profitSorted.forEach((opt, index) => {
        const rank = index + 1
        let colorClass = 'bg-rose-500 text-white shadow-rose-200'

        if (rank <= 1) colorClass = 'bg-emerald-500 text-white shadow-emerald-200'
        else if (third > 0 && rank <= third) colorClass = 'bg-emerald-400 text-white shadow-emerald-200'
        else if (third > 0 && rank <= third * 2) colorClass = 'bg-amber-400 text-white shadow-amber-200'

        profitabilityMap.set(opt.id, { rank, colorClass })
    })

    const sortedOptions = sortOptions(options)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-xl">
                <DialogHeader className="px-6 py-5 border-b bg-gray-50/50 space-y-1 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSinSeguro ? 'bg-orange-100' : 'bg-indigo-100'}`}>
                            {isSinSeguro ? (
                                <ShieldAlert className="w-5 h-5 text-orange-600" />
                            ) : (
                                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Financiación {isSinSeguro ? 'Sin Seguro' : 'Con Seguro'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Gestiona qué oferta financiera se muestra públicamente.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative min-h-0">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Cargando ofertas...</p>
                        </div>
                    ) : options.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <Banknote className="h-12 w-12 text-gray-300 mb-3" />
                            <h3 className="text-gray-900 font-medium">Sin ofertas calculadas</h3>
                            <p className="text-sm text-gray-500 max-w-xs mt-1">
                                No se han encontrado resultados. Prueba a recalcular desde la tabla principal.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto h-full w-full">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('rank')}>
                                            <div className="flex items-center gap-1">
                                                Rank (Rentabilidad)
                                                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Entidad</th>
                                        <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fee')}>
                                            <div className="flex items-center justify-end gap-1">
                                                Cuota Mensual
                                                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('tin')}>
                                            <div className="flex items-center justify-end gap-1">
                                                TIN
                                                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {sortedOptions.map((opt) => {
                                        const { rank, colorClass } = profitabilityMap.get(opt.id) || { rank: null, colorClass: 'bg-gray-100 text-gray-400 border border-gray-200' } as any
                                        return (
                                            <tr
                                                key={opt.id}
                                                className={`
                                                    group transition-colors hover:bg-gray-50/80
                                                    ${opt.isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : ''}
                                                `}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shadow-sm ${colorClass}`}>
                                                        {rank || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        {opt.bankName}
                                                        {opt.isSelected && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-700">
                                                                ACTUAL
                                                            </span>
                                                        )}
                                                    </div>
                                                    {opt.financialCode && (
                                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                                            {opt.financialCode}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-base font-bold text-gray-900">
                                                        {opt.monthlyFee.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-500 font-medium">
                                                    {opt.interestRate.toFixed(2)}%
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleSelect(opt.id)}
                                                        disabled={opt.isSelected || selectingId !== null}
                                                        className={`
                                                            inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg transition-all
                                                            ${opt.isSelected
                                                                ? 'text-green-700 bg-green-50 border border-green-200 cursor-default opacity-100'
                                                                : 'text-white bg-gray-900 hover:bg-indigo-600 shadow-sm hover:shadow active:scale-95'
                                                            }
                                                            disabled:opacity-50 disabled:cursor-not-allowed
                                                        `}
                                                    >
                                                        {selectingId === opt.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : opt.isSelected ? (
                                                            <><Check className="h-3.5 w-3.5 mr-1.5" /> Seleccionado</>
                                                        ) : (
                                                            'Elegir'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <div>
                        Mostrando {options.length} opciones disponibles
                    </div>
                    <button onClick={onClose} className="hover:text-gray-900 font-medium transition-colors">
                        Cerrar ventana
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
