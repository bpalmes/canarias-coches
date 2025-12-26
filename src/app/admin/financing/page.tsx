import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getActiveDealershipId } from '@/lib/auth-helpers'
import { getFinancingKanbanReqs } from "@/actions/crm-financing-actions"
import { FinancingKanbanBoard } from "./components/FinancingKanbanBoard"
import { KanbanFinancingReq } from "./types"

export default async function FinancingCRMPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Allow Super Admin or Dealership User
    if (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN') {
        redirect('/login')
    }

    const dealershipId = await getActiveDealershipId(session)

    const result = await getFinancingKanbanReqs(dealershipId)
    const reqs = result.success ? (result.data as unknown as KanbanFinancingReq[]) : []

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Operaciones de Financiación</h1>
                    <p className="text-sm text-gray-500">
                        {dealershipId ? 'Seguimiento de operaciones' : 'Sin datos (Seleccione concesionario)'}
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-slate-50 overflow-hidden">
                <FinancingKanbanBoard initialReqs={reqs} />
            </div>
        </div>
    )
}
