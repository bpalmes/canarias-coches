'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// Import the new action
import { calculateFinancialOptions, CalculatorResponse } from '@/actions/calculate-financial'

interface FinancialCalculatorProps {
    interestRates: { id: number, name: string, value: number }[]
    loanTerms: { id: number, name: string, months: number }[]
}

export function FinancialCalculator({ interestRates, loanTerms }: FinancialCalculatorProps) {
    const [isPending, startTransition] = useTransition()

    const [results, setResults] = useState<CalculatorResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])

    // Financiado
    const [price, setPrice] = useState<number>(15000)
    const [rateId, setRateId] = useState<string>("")
    const [termId, setTermId] = useState<string>("")

    // Contado
    const [contadoPrice, setContadoPrice] = useState<number>(16000)

    // Options
    const [noInsurance, setNoInsurance] = useState<boolean>(false)
    const [warranty, setWarranty] = useState<string>("0") // "0" cost

    const handleCalculate = () => {
        setError(null)
        setResults(null)

        // Find selected rate and term values
        const rateObj = interestRates.find(r => r.id.toString() === rateId)
        const termObj = loanTerms.find(t => t.id.toString() === termId)

        if (!rateObj || !termObj) {
            setError("Por favor seleccione Interés y Plazo")
            return
        }

        startTransition(async () => {
            const res = await calculateFinancialOptions({
                registrationDate: date,
                loanAmount: price,
                loanRate: rateObj.value,
                loanTerm: termObj.months,
                wholePrice: contadoPrice,
                wholeRate: rateObj.value,
                guarantee: parseFloat(warranty),
                sinSeguro: noInsurance
            })

            if (res.success && res.data) {
                setResults(res.data)
            } else {
                setError(res.message || "Error al calcular.")
            }
        })
    }

    // Helper for gradient badges
    const getBadgeStyle = (index: number, total: number) => {
        if (total <= 1) return { backgroundColor: 'hsl(120, 85%, 48%)', color: 'white' }
        const percentage = index / (total - 1)
        const hue = 120 - (percentage * 100)
        const saturation = 85 - (percentage * 15)
        const lightness = 48 + (percentage * 2)
        return {
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            color: 'white'
        }
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid gap-6 py-4">
                {/* 1. Vehicle Data */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <Label className="mb-2 block text-sm font-medium text-gray-700">Datos del vehículo</Label>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="date">Fecha de Matriculación</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-indigo-100 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 2. Financiado Configuration */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 border-b pb-2">Financiado</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Precio a Financiar</Label>
                                <div className="flex">
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="rounded-r-none bg-indigo-900 text-white font-semibold border-indigo-900"
                                    />
                                    <div className="flex items-center justify-center bg-gray-100 border border-l-0 rounded-r-md px-3 text-gray-500">€</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Interés</Label>
                                <Select value={rateId} onValueChange={setRateId}>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {interestRates.map(rate => (
                                            <SelectItem key={rate.id} value={rate.id.toString()}>{rate.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Plazo</Label>
                                <Select value={termId} onValueChange={setTermId}>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900">
                                        <SelectValue placeholder="Seleccionar meses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loanTerms.map(term => (
                                            <SelectItem key={term.id} value={term.id.toString()}>{term.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Contado Configuration */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm opacity-90">
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 border-b pb-2">Al Contado</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Precio al Contado</Label>
                                <div className="flex">
                                    <Input
                                        type="number"
                                        value={contadoPrice}
                                        onChange={(e) => setContadoPrice(Number(e.target.value))}
                                        className="rounded-r-none bg-indigo-900 text-white font-semibold border-indigo-900"
                                    />
                                    <div className="flex items-center justify-center bg-gray-100 border border-l-0 rounded-r-md px-3 text-gray-500">€</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Interés (Contado)</Label>
                                <Select disabled value={rateId}>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900 opacity-50">
                                        <SelectValue placeholder={rateId ? interestRates.find(r => r.id.toString() === rateId)?.name : "Igual que financiado"} />
                                    </SelectTrigger>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Extra Options */}
                <div className="rounded-lg border bg-white p-4 shadow-sm spacing-y-4">
                    <div className="space-y-2 mb-4">
                        <Label>¿Añadir garantía?</Label>
                        <Select value={warranty} onValueChange={setWarranty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sin garantía" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sin garantía</SelectItem>
                                <SelectItem value="300">Garantía Extendida (+300€)</SelectItem>
                                <SelectItem value="500">Garantía Premium (+500€)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="no-insurance"
                            checked={noInsurance}
                            onCheckedChange={(c) => setNoInsurance(!!c)}
                        />
                        <label
                            htmlFor="no-insurance"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Sin Seguro (Mostrar columnas SS)
                        </label>
                    </div>
                </div>

                <Button
                    onClick={handleCalculate}
                    disabled={isPending}
                    className="w-full bg-indigo-900 hover:bg-indigo-800 text-white py-6 text-lg font-bold"
                >
                    {isPending ? 'CALCULANDO...' : 'CALCULAR'}
                </Button>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-md text-center">
                        {error}
                    </div>
                )}

                {/* 5. Results */}
                {results && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Financiado Results */}
                        <div className="rounded-lg border bg-white shadow-sm p-4">
                            <h3 className="mb-4 text-md font-bold text-gray-900">Financiado (V2)</h3>
                            {results.financiado.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No hay opciones disponibles.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="pb-2 text-center">In</th>
                                            <th className="pb-2 text-left">Banco</th>
                                            <th className="pb-2 text-right">Cuota</th>
                                            <th className="pb-2 text-right">Código</th>
                                            {noInsurance && <th className="pb-2 text-right text-xs">Cuota SS</th>}
                                            {noInsurance && <th className="pb-2 text-right text-xs">Código SS</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {results.financiado.map((opt, i) => (
                                            <tr key={`${opt.bank_name}-${i}`} className="hover:bg-gray-50">
                                                <td className="py-3 text-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto"
                                                        style={getBadgeStyle(i, results.financiado.length)}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                </td>
                                                <td className="py-3 font-medium text-gray-900">{opt.bank_name}</td>
                                                <td className="py-3 text-right font-bold text-gray-900">{opt.coef_fee} €</td>
                                                <td className="py-3 text-right text-gray-500 font-mono text-xs">{opt.coef_ref}</td>
                                                {noInsurance && <td className="py-3 text-right text-gray-400 font-mono text-xs">{opt.coef_fee_ss} €</td>}
                                                {noInsurance && <td className="py-3 text-right text-gray-400 font-mono text-xs">{opt.coef_ref_ss}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Contado Results */}
                        <div className="rounded-lg border bg-white shadow-sm p-4">
                            <h3 className="mb-4 text-md font-bold text-gray-900">Al Contado (V2)</h3>
                            {results.contado.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No hay datos disponibles.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="pb-2 text-center">In</th>
                                            <th className="pb-2 text-left">Banco</th>
                                            <th className="pb-2 text-right">Cuota/Rent.</th>
                                            <th className="pb-2 text-right">Código</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {results.contado.map((opt, i) => (
                                            <tr key={`${opt.bank_name}-${i}`} className="hover:bg-gray-50">
                                                <td className="py-3 text-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto"
                                                        style={getBadgeStyle(i, results.contado.length)}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                </td>
                                                <td className="py-3 font-medium text-gray-900">{opt.bank_name}</td>
                                                <td className="py-3 text-right font-bold text-gray-900">{opt.cont_fee} €</td>
                                                <td className="py-3 text-right text-gray-500 font-mono text-xs">{opt.cont_ref}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
