import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CalculatorTabs } from "@/components/financial/CalculatorTabs"

export default async function CalculatorPage() {
    const session = await getServerSession(authOptions)

    // Strictly restrict to Super Admin
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/admin')
    }

    // Fetch Financial Configs
    const activeRates = await prisma.financialInterestRate.findMany({ where: { isActive: true }, orderBy: { value: 'asc' } })
    const activeTerms = await prisma.financialLoanTerm.findMany({ where: { isActive: true }, orderBy: { durationMonths: 'asc' } })

    const formattedRates = activeRates.map(r => ({ id: r.id, name: r.name, value: Number(r.value) }))
    const formattedTerms = activeTerms.map(t => ({ id: t.id, name: t.name, months: t.durationMonths }))

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Calculadora Financiera</h1>
            <CalculatorTabs
                interestRates={formattedRates}
                loanTerms={formattedTerms}
            />
        </div>
    )
}
