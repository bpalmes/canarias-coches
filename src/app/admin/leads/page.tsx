import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getActiveDealershipId } from '@/lib/auth-helpers'
import { getKanbanLeads } from "@/actions/crm-lead-actions"
import { CRMKanbanBoard } from "./components/CRMKanbanBoard"
import { KanbanLead } from "./types"

export default async function LeadsDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Allow Super Admin validation or Dealership User
  if (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN') {
    redirect('/login')
  }

  // Use the helper that supports Super Admin Impersonation
  // If returns undefined (Global Super Admin), getKanbanLeads will fetch Platform Leads (dealershipId: null)
  const dealershipId = await getActiveDealershipId(session)

  const result = await getKanbanLeads(dealershipId)

  // Explicitly cast the data to match the Client Component type if needed, 
  // though TypeScript should infer it if the Server Action return type is compatible.
  // We use 'as KanbanLead[]' because of the specific partial selects in Prisma.
  // The Action returns 'any' or inferred type. We cast for safety/compatibility.
  const leads = result.success ? (result.data as unknown as KanbanLead[]) : []

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CRM Leads</h1>
          <p className="text-sm text-gray-500">
            {dealershipId ? 'Gestión de oportunidades asignadas' : 'Leads de la Plataforma (Sin asignar)'}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Future: Add 'New Lead' button here */}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 overflow-hidden">
        <CRMKanbanBoard initialLeads={leads} />
      </div>
    </div>
  )
}
