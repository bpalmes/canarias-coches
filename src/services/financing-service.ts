import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FinancingService {

    /**
     * Get active financing conditions for a dealership.
     */
    async getConditions(dealershipId: number) {
        return prisma.financingCondition.findMany({
            where: { dealershipId, isActive: true },
        })
    }

    /**
     * Create a default condition for a dealership.
     */
    async createCondition(data: {
        dealershipId: number
        name: string
        interestRate: number
        minTerm?: number
        maxTerm?: number
    }) {
        return prisma.financingCondition.create({
            data: {
                ...data,
            }
        })
    }

    /**
     * Calculate monthly fee based on specific params.
     * Formula: Standard amortization (French method often, or simple interest depending on requirement).
     * Using simplified formula: P * r / (1 - (1 + r)^-n)
     * where r = annualRate / 12 / 100
     */
    calculateMonthlyFee(principal: number, annualInterestRate: number, months: number): number {
        if (annualInterestRate === 0) return principal / months

        const monthlyRate = annualInterestRate / 12 / 100
        const numerator = monthlyRate * Math.pow(1 + monthlyRate, months)
        const denominator = Math.pow(1 + monthlyRate, months) - 1

        const quota = principal * (numerator / denominator)
        return parseFloat(quota.toFixed(2))
    }

    /**
     * Run a simulation for a specific car and condition.
     */
    async simulate(carPrice: number, downPayment: number, months: number, conditionId: number) {
        const condition = await prisma.financingCondition.findUnique({ where: { id: conditionId } })
        if (!condition) throw new Error('Condition not found')

        if (months < condition.minTerm || months > condition.maxTerm) {
            throw new Error(`Term must be between ${condition.minTerm} and ${condition.maxTerm} months`)
        }

        const principal = carPrice - downPayment
        if (principal <= 0) throw new Error('Down payment cannot exceed price')

        const monthlyFee = this.calculateMonthlyFee(principal, condition.interestRate, months)

        return {
            carPrice,
            downPayment,
            principal,
            months,
            interestRate: condition.interestRate,
            monthlyFee,
            totalCost: parseFloat((monthlyFee * months).toFixed(2)),
            totalInterests: parseFloat(((monthlyFee * months) - principal).toFixed(2))
        }
    }
}
