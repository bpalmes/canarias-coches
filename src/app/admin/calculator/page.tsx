import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CalculatorTabs } from "@/components/financial/CalculatorTabs"
import { getActiveDealershipId } from "@/lib/auth-helpers"

export default async function CalculatorPage() {
    const session = await getServerSession(authOptions)
    const activeDealershipId = await getActiveDealershipId(session)

    // Strictly restrict to Real Super Admin (No impersonation)
    // If activeDealershipId is set and we are Super Admin, it means we are impersonating.
    // We want to BLOCK in that case.
    // If normal Super Admin: role=SUPER, dealershipId=null (session), activeDealershipId=undefined.

    // Logic: 
    // Is Super Admin? Yes.
    // Is Impersonating? (activeDealershipId !== undefined).
    // If Impersonating -> Redirect.

    const isImpersonating = session?.user.role === 'SUPER_ADMIN' && !!activeDealershipId;

    if (!session || session.user.role !== 'SUPER_ADMIN' || isImpersonating) {
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
