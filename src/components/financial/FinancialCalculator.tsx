'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { calculateFinancialOptions, CalculationResult } from '@/actions/financial-calculator'

interface FinancialCalculatorProps {
    interestRates: { id: number, name: string, value: number }[]
    loanTerms: { id: number, name: string, months: number }[]
}

export function FinancialCalculator({ interestRates, loanTerms }: FinancialCalculatorProps) {
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<CalculationResult | null>(null)

    // Form State
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [price, setPrice] = useState<number>(15000)

    // Financiado
    const [financedRateId, setFinancedRateId] = useState<string>("")
    const [financedTermId, setFinancedTermId] = useState<string>("")

    // Contado
    const [contadoPrice, setContadoPrice] = useState<number>(15000)

    // Options
    const [noInsurance, setNoInsurance] = useState<boolean>(false)
    const [warranty, setWarranty] = useState<string>("no_warranty")

    const handleCalculate = () => {
        startTransition(async () => {
            const res = await calculateFinancialOptions({
                registrationDate: new Date(date),
                price: price,
                financedAmount: price,
                interestRateId: (financedRateId && financedRateId !== "all") ? parseInt(financedRateId) : undefined,
                termId: (financedTermId && financedTermId !== "all") ? parseInt(financedTermId) : undefined,
                availableInsurance: !noInsurance
            })
            setResult(res)
        })
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
                                <Label>Precio</Label>
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
                                <Select value={financedRateId} onValueChange={setFinancedRateId}>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Cualquiera</SelectItem>
                                        {interestRates.map(rate => (
                                            <SelectItem key={rate.id} value={rate.id.toString()}>{rate.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Plazo</Label>
                                <Select value={financedTermId} onValueChange={setFinancedTermId}>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900">
                                        <SelectValue placeholder="Seleccionar meses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Cualquiera</SelectItem>
                                        {loanTerms.map(term => (
                                            <SelectItem key={term.id} value={term.id.toString()}>{term.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Contado Configuration */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm opacity-70">
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 border-b pb-2">Al Contado</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Precio</Label>
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
                                <Label>Interés</Label>
                                <Select disabled>
                                    <SelectTrigger className="bg-indigo-900 text-white border-indigo-900">
                                        <SelectValue placeholder="Seleccionar tipo" />
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
                                <SelectItem value="no_warranty">Sin garantía</SelectItem>
                                <SelectItem value="extended">Garantía Extendida (+300€)</SelectItem>
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

                {/* 5. Results */}
                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Financiado Results */}
                        <div className="rounded-lg border bg-white shadow-sm p-4">
                            <h3 className="mb-4 text-md font-bold text-gray-900">Financiado (V2)</h3>
                            {result.financiado.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No hay opciones disponibles.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="pb-2 text-center">In</th>
                                            <th className="pb-2 text-left">Banco</th>
                                            <th className="pb-2 text-right">Cuota</th>
                                            <th className="pb-2 text-right">Código</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {result.financiado.map((opt, i) => (
                                            <tr key={`${opt.entityId}-${opt.interestRate}-${i}`} className="hover:bg-gray-50">
                                                <td className="py-3 text-center">
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white
                                                        ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-green-400' : i === 2 ? 'bg-yellow-400' : 'bg-yellow-600'}
                                                    `}>
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3 font-medium text-gray-900">{opt.entityName}</td>
                                                <td className="py-3 text-right font-bold text-gray-900">{opt.monthlyPayment.toFixed(2)} €</td>
                                                <td className="py-3 text-right text-gray-500 font-mono text-xs">{opt.code}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Contado Results */}
                        <div className="rounded-lg border bg-white shadow-sm p-4">
                            <h3 className="mb-4 text-md font-bold text-gray-900">Al Contado (V2)</h3>
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <p>No hay datos disponibles.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
