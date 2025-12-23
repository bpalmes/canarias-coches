'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Prisma } from "@prisma/client"

export type CalculatorInput = {
    registrationDate: Date | string
    loanAmount: number      // The amount requested to finance
    loanRate: number
    loanTerm: number        // Months
    wholePrice: number      // Price if paying cash
    wholeRate?: number      // Interest rate for cash simulation (optional, defaults to loanRate)
    guarantee?: number      // Guarantee cost (added to loan amount)
    sinSeguro?: boolean     // Admin only: show sinSeguro columns
}

export type CalculatorResultItem = {
    entityId: number
    bank_name: string
    // Financed
    coef_fee?: string       // Formatted
    coef_ref?: string
    coef_rate?: number
    coef_fee_ss?: string    // Sin Seguro
    coef_ref_ss?: string
    // Cash / Contado
    cont_fee?: string
    cont_ref?: string
    cont_rate?: number
    // Shared
    loan_term: number
    max_loan_term_display: string
    rentabilidad_porcentaje?: number
    // Raw values for backend consumption
    payment_amount?: number
    payment_amount_ss?: number
    contado_amount?: number
}

export type CalculatorResponse = {
    financiado: CalculatorResultItem[]
    contado: CalculatorResultItem[]
}

// Helpers
function calculateVehicleAge(date: Date | string): number {
    const d = new Date(date)
    const now = new Date()
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    if (now.getDate() < d.getDate()) months--
    return Math.max(0, months)
}

function formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatReferenceCode(value: number): string {
    const intVal = Math.round(value)
    return `C${intVal.toString().padStart(6, '0')}`
}

export async function calculateFinancialOptions(input: CalculatorInput): Promise<{ success: boolean, data?: CalculatorResponse, message?: string }> {
    try {
        const { registrationDate, loanAmount, loanRate, loanTerm, wholePrice, guarantee = 0, sinSeguro = false } = input
        const wholeRate = input.wholeRate ?? loanRate

        // 1. Determine Campaign (Strict)
        const ageMonths = calculateVehicleAge(registrationDate)
        const isVN = ageMonths <= 6
        const campaignCode = isVN ? 'vn' : 'vo'

        // 2. Fetch Rules (Strict Match)
        const details = await prisma.financialConfigurationDetail.findMany({
            where: {
                isActive: true,
                loanTerm: { durationMonths: loanTerm },
                campaign: { code: campaignCode }, // STRICT FILTER RESTORED
                interestRate: {
                    value: { in: [loanRate, wholeRate] }
                }
            },
            include: {
                configuration: { include: { entity: true } },
                interestRate: true,
                loanTerm: true
            }
        })

        // Group by Entity ID
        const byEntity = new Map<number, typeof details>()
        for (const d of details) {
            // Optional: Extra safety check on Age Rows if they exist
            // But strict campaign code match is primary.
            if (d.minVehiculoAgeMonths !== null && ageMonths < d.minVehiculoAgeMonths) continue;
            if (d.maxVehiculoAgeMonths !== null && ageMonths > d.maxVehiculoAgeMonths) continue;

            const eid = d.configuration.entityId
            if (!byEntity.has(eid)) byEntity.set(eid, [])
            byEntity.get(eid)!.push(d)
        }

        const financiadoResults: CalculatorResultItem[] = []
        const contadoResults: CalculatorResultItem[] = []

        // 3. Process Each Entity
        for (const [entityId, rules] of byEntity.entries()) {
            const entityName = rules[0].configuration.entity.name

            // --- FINANCIADO ---
            const coefRule = rules.find(r => r.calculationType === 'coeficiente' && Number(r.interestRate.value) === loanRate)
            const rentRule = rules.find(r => r.calculationType === 'rentabilidad' && Number(r.interestRate.value) === loanRate)

            // Optional SS rules
            const coefSSRule = rules.find(r => r.calculationType === 'coeficiente_sin_seguro' && Number(r.interestRate.value) === loanRate)
            const rentSSRule = rules.find(r => r.calculationType === 'rentabilidad_sin_seguro' && Number(r.interestRate.value) === loanRate)

            if (coefRule && rentRule) {
                const amountForCalc = loanAmount + guarantee
                const coefVal = Number(coefRule.value)
                const rentVal = Number(rentRule.value)

                const fee = (amountForCalc * coefVal) / 100
                const ref = (amountForCalc * rentVal) / 100

                // SS
                let feeSSStr: string | undefined
                let refSSStr: string | undefined
                let feeSS: number | undefined

                if (sinSeguro && coefSSRule && rentSSRule) {
                    feeSS = (amountForCalc * Number(coefSSRule.value)) / 100
                    const refSS = (amountForCalc * Number(rentSSRule.value)) / 100
                    feeSSStr = formatCurrency(feeSS)
                    refSSStr = formatReferenceCode(refSS)
                }

                financiadoResults.push({
                    entityId: entityId,
                    bank_name: entityName,
                    coef_fee: formatCurrency(fee),
                    coef_ref: formatReferenceCode(ref),
                    loan_term: loanTerm,
                    max_loan_term_display: `${loanTerm} meses`,
                    coef_rate: loanRate,
                    rentabilidad_porcentaje: rentVal,
                    coef_fee_ss: feeSSStr,
                    coef_ref_ss: refSSStr,
                    // Raw
                    payment_amount: fee,
                    payment_amount_ss: feeSS
                })
            }

            // --- CONTADO ---
            const cCoefRule = rules.find(r => r.calculationType === 'coeficiente' && Number(r.interestRate.value) === wholeRate)
            const cRentRule = rules.find(r => r.calculationType === 'rentabilidad' && Number(r.interestRate.value) === wholeRate)

            if (cRentRule) {
                const rentVal = Number(cRentRule.value)
                const diff = wholePrice - loanAmount
                const baseRef = (wholePrice * rentVal) / 100
                const totalRef = baseRef + diff

                let contFeeStr = 'N/A'
                if (cCoefRule) {
                    const fee = (wholePrice * Number(cCoefRule.value)) / 100
                    contFeeStr = formatCurrency(fee)
                }

                contadoResults.push({
                    entityId: entityId,
                    bank_name: entityName,
                    cont_fee: contFeeStr,
                    cont_ref: formatReferenceCode(totalRef),
                    loan_term: loanTerm,
                    max_loan_term_display: `${loanTerm} meses`,
                    cont_rate: wholeRate,
                    rentabilidad_porcentaje: rentVal,
                    contado_amount: cCoefRule ? (wholePrice * Number(cCoefRule.value)) / 100 : undefined
                })
            }
        }

        // Sort by Reference Code DESC
        financiadoResults.sort((a, b) => (b.coef_ref || '').localeCompare(a.coef_ref || ''))
        contadoResults.sort((a, b) => (b.cont_ref || '').localeCompare(a.cont_ref || ''))

        return {
            success: true,
            data: {
                financiado: financiadoResults,
                contado: contadoResults
            }
        }

    } catch (error) {
        console.error("Calculation Error:", error)
        return { success: false, message: "Error interno al calcular." }
    }
}
