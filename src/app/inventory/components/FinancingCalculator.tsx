'use client'

import { useState, useEffect } from 'react'

export default function FinancingCalculator({ price }: { price: number }) {
    const [entry, setEntry] = useState(price * 0.2) // 20% default entry
    const [months, setMonths] = useState(60)
    const interestRate = 6.99 // Should fetch from dealer conditions in real app

    const [monthlyFee, setMonthlyFee] = useState(0)

    useEffect(() => {
        const principal = price - entry
        if (principal <= 0) {
            setMonthlyFee(0)
            return
        }
        const r = interestRate / 12 / 100
        const numerator = r * Math.pow(1 + r, months)
        const denominator = Math.pow(1 + r, months) - 1
        const quota = principal * (numerator / denominator)
        setMonthlyFee(quota)
    }, [price, entry, months])

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora de Financiación</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Entrada ({entry.toLocaleString()}€)</label>
                    <input
                        type="range"
                        min="0"
                        max={price * 0.8}
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

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-baseline">
                        <span className="text-gray-500 text-sm">Cuota Estimada</span>
                        <span className="text-3xl font-bold text-blue-600">{monthlyFee.toFixed(2)}€<span className="text-sm font-normal text-gray-500">/mes</span></span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-right">TIN {interestRate}% (Estimado)</p>
                </div>
            </div>
        </div>
    )
}
