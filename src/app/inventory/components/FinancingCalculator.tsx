'use client'

import { useState, useEffect } from 'react'
import { calculateFinancialOptions, FinancialResultOption } from '@/actions/financial-calculator'

interface FinancingCalculatorProps {
    price: number
    dealershipId?: number
    year?: number
    month?: number
}

export default function FinancingCalculator({ price, dealershipId, year = 2020, month = 1 }: FinancingCalculatorProps) {
    const [entry, setEntry] = useState(price * 0.2)
    const [months, setMonths] = useState(60)
    const [results, setResults] = useState<FinancialResultOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // Debounce calculation
        const timer = setTimeout(() => {
            fetchOptions()
        }, 500)
        return () => clearTimeout(timer)
    }, [price, entry, months, dealershipId])

    const fetchOptions = async () => {
        setIsLoading(true)
        setError('')
        try {
            const principal = price - entry
            if (principal <= 0) {
                setResults([])
                setIsLoading(false)
                return
            }

            // Construct date from year/month
            const regDate = new Date(year, month - 1, 1)

            const data = await calculateFinancialOptions({
                registrationDate: regDate,
                price: price,
                financedAmount: principal,
                monthlyTerm: months,
                availableInsurance: true, // Default to true, backend will override if dealership disabled it
                dealershipId: dealershipId
            })

            setResults(data.financiado)
        } catch (err) {
            console.error(err)
            setError('Error calculando financiación')
        } finally {
            setIsLoading(false)
        }
    }

    const bestOption = results.length > 0 ? results[0] : null

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora de Financiación</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Entrada</label>
                    <input
                        type="range"
                        min="0"
                        max={price}
                        step="100"
                        value={entry}
                        onChange={(e) => setEntry(Number(e.target.value))}
                        className="w-full mt-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Plazo ({months} meses)</label>
                    <select
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        {[12, 24, 36, 48, 60, 72, 84, 96, 120].map(m => (
                            <option key={m} value={m}>{m} meses ({(m / 12).toFixed(0)} años)</option>
                        ))}
                    </select>
                </div>

                <div className="pt-4 border-t border-gray-200 min-h-[100px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <span className="text-sm text-gray-500">Calculando mejores cuotas...</span>
                        </div>
                    ) : bestOption ? (
                        <>
                            <div className="flex justify-between items-baseline">
                                <span className="text-gray-500 text-sm">Mejor Cuota ({bestOption.entityName})</span>
                                <span className="text-3xl font-bold text-blue-600">{bestOption.monthlyPayment.toFixed(2)}€<span className="text-sm font-normal text-gray-500">/mes</span></span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-right">TIN {bestOption.interestRate}%</p>

                            {results.length > 1 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">Otras opciones:</p>
                                    <div className="space-y-1">
                                        {results.slice(1, 4).map((opt, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span>{opt.entityName}</span>
                                                <span className="font-semibold">{opt.monthlyPayment.toFixed(2)}€</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 text-sm py-4">
                            {error || "No hay opciones de financiación disponibles con estos parámetros."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
