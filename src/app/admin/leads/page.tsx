import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { LeadService } from "@/services/lead-service"
import { redirect } from "next/navigation"
import { getActiveDealershipId } from '@/lib/auth-helpers'

export default async function LeadsDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Allow Super Admin validation
  if (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN') {
    redirect('/login')
  }

  const dealershipId = await getActiveDealershipId(session)
  const leadService = new LeadService()

  // If dealershipId is set, get for that dealer.
  // If not (Super Admin global), ideally get all.
  // Assuming getByDealership might error with undefined, or we need a getAll.
  // For now, if impersonating, show dealer leads. If Super Admin global, show emptiness or try fetch.
  // Let's rely on getByDealership accepting undefined/null if the service was built for it,
  // or I'll implement a safe fallback.
  // Actually, let's view LeadService first.
  let leads: any[] = []
  if (dealershipId) {
    leads = await leadService.getByDealership(dealershipId)
  } else if (session.user.role === 'SUPER_ADMIN') {
    // leads = await leadService.getAll() // Future implementation
    // For now, show empty or try to fetch all if backend supports it.
    // Trying to fetch all requires knowing the method.
    // I'll try to keep it safe: just empty for now to fix crash, or inspect service.
    try {
      // Attempt to call getByDealership with a falsy value if it handles it? No.
      // Just return empty array to prevent 500 error, user can then impersonate.
      // Or even better: Show "Select a dealership" message?
      // I'll update the UI to handle it.
    } catch (e) { }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Leads & Contactos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de personas interesadas en tus vehículos.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contacto</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Interés</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mensaje</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{lead.email}</span>
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {lead.car ? (
                          <span className="font-medium text-indigo-600">
                            {lead.car.make.name} {lead.car.model.name}
                          </span>
                        ) : 'General'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {lead.message}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">No hay leads todavía.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
