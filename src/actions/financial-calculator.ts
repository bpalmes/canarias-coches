'use server'

import { prisma } from "@/lib/prisma"
import { FinancialEntity } from "@prisma/client"

export interface CalculationInput {
    registrationDate: Date
    price: number
    financedAmount: number
    interestRateId?: number // Optional specific rate
    termId?: number // Optional specific term
    monthlyTerm?: number // Raw number of months
    isContado?: boolean
    availableInsurance?: boolean // "Sin Seguro" unchecked = available
}

export interface FinancialResultOption {
    entityName: string
    entityId: number
    monthlyPayment: number
    totalCost: number
    interestRate: number
    term: number
    code: string // generated code
    isBest?: boolean
}

export interface CalculationResult {
    financiado: FinancialResultOption[]
    contado: FinancialResultOption[]
}

/**
 * Calculates financial options based on the input and DB configuration.
 * Uses French Amortization method as backup if explicit coefficients are not found.
 */
export async function calculateFinancialOptions(input: CalculationInput): Promise<CalculationResult> {
    // 1. Determine Campaign (VN/VO)
    const now = new Date()
    const ageMonths = (now.getFullYear() - input.registrationDate.getFullYear()) * 12 +
        (now.getMonth() - input.registrationDate.getMonth())

    const campaignCode = ageMonths <= 12 ? 'vn' : 'vo'

    // 2. Load Base Data
    const entities = await prisma.financialEntity.findMany({
        where: { isActive: true },
        include: { configurations: { where: { isLive: true } } }
    })

    // If specific rate requested, fetch it, otherwise fetch all
    const rates = await prisma.financialInterestRate.findMany({
        where: { isActive: true, ...(input.interestRateId ? { id: input.interestRateId } : {}) }
    })

    // If specific term requested, fetch it, otherwise fetch logical nearby terms or all
    // For simplicity, if termId is not passed but monthlyTerm is, we find the closest match
    const terms = await prisma.financialLoanTerm.findMany({
        where: { isActive: true }
    })

    const results: FinancialResultOption[] = []
    const contadoResults: FinancialResultOption[] = []

    // 3. Logic
    for (const entity of entities) {
        if (!entities.length) continue

        // A. FINANCIADO LOGIC
        for (const rate of rates) {
            // Filter terms:
            // If user selected a term ID, use only that.
            // If user typed a term (month), find closest? Or just standard ones?
            // User UI selects "36 meses", "48 meses" etc. via ID usually.

            const applicableTerms = input.termId
                ? terms.filter(t => t.id === input.termId)
                : terms.filter(t => input.monthlyTerm ? t.durationMonths === input.monthlyTerm : true)

            for (const term of applicableTerms) {

                // STANDARD FRENCH AMORTIZATION CALCULATION
                const tin = Number(rate.value)
                const months = term.durationMonths
                const capital = input.financedAmount

                if (capital > 0) {
                    // Rate per month
                    const r = (tin / 100) / 12
                    // Formula: P = L * [r(1+r)^n] / [(1+r)^n - 1]
                    const numerator = r * Math.pow(1 + r, months)
                    const denominator = Math.pow(1 + r, months) - 1
                    let monthlyPayment = capital * (numerator / denominator)

                    // Add Insurance if applicable (Simulated: +20€/month just for demo if "With Insurance")
                    if (input.availableInsurance) {
                        monthlyPayment += 20 // Dummy logic for "Seguro de Vida"
                    }

                    // Add Opening Commission (Simulated: +350€ spread over term? Or cash?)
                    // Usually Opening Commission is financed.
                    // Let's assume 2.5% opening commission added to Capital
                    const openingCommission = capital * 0.025
                    const finalCapital = capital + openingCommission

                    // Recalculate with commissioned capital
                    const monthlyPaymentWithComm = finalCapital * (rate.value.toNumber() / 100 / 12 * Math.pow(1 + rate.value.toNumber() / 100 / 12, months)) / (Math.pow(1 + rate.value.toNumber() / 100 / 12, months) - 1)

                    results.push({
                        entityName: entity.name,
                        entityId: entity.id,
                        monthlyPayment: parseFloat(monthlyPaymentWithComm.toFixed(2)),
                        totalCost: parseFloat((monthlyPaymentWithComm * months).toFixed(2)),
                        interestRate: Number(rate.value),
                        term: months,
                        code: `C${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}` // Mock Code
                    })
                }
            }
        }
    }

    // B. CONTADO LOGIC (Simplified)
    // Contado usually just means "Price - Discount" if applicable, or just Price.
    // The existing calculator shows "Cuota" for Contado? Maybe a personal loan simulation?
    // Or maybe "Rentabilidad" means the dealer profit?
    // Let's assume Contado is just a simulation of a personal loan at a higher Standard Rate (e.g. 8-9%)?
    // Or maybe just empty as per screenshot "No hay datos disponibles" (often banks don't fund contado).
    // But let's populate it with a generic "Bank Loan" option just in case.

    // Simulate one generic "Contado" option (e.g. paying with your own bank)
    // or leave empty if the screenshot suggests. The screenshot shows "No hay datos".
    // Let's leave Contado empty for now unless we have specific rules.

    // Sort by lowest monthly payment
    results.sort((a, b) => a.monthlyPayment - b.monthlyPayment)

    return {
        financiado: results.slice(0, 10), // Top 10
        contado: []
    }
}
