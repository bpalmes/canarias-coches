import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { FinancingRequestService } from "@/services/financing-request-service"
import { redirect } from "next/navigation"
import { getActiveDealershipId } from '@/lib/auth-helpers'

export default async function FinancingDashboard() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Allow Super Admin validation
    if (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN') {
        redirect('/login')
    }

    const dealershipId = await getActiveDealershipId(session)
    const service = new FinancingRequestService()

    // Note: This might fail if the DB migration hasn't been applied yet.
    // Ensure the user runs `npx prisma db push` if they see errors.
    let requests: any[] = []
    try {
        if (dealershipId) {
            requests = await service.getByDealership(dealershipId)
        }
        // If Super Admin (no dealershipId), we could fetch global, but for now empty list is safe.
    } catch (e) {
        console.error("Failed to fetch financing requests. DB might be out of sync.", e)
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Operaciones de Financiación</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona las solicitudes de financiación y envíalas a Genesis.
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Cliente</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehículo</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Importe</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Plazo</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {requests.map((req) => (
                                        <tr key={req.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {req.lead?.firstName} {req.lead?.lastName}
                                                <br />
                                                <span className="text-gray-500 font-normal">{req.lead?.email}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {req.car?.make?.name} {req.car?.model?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {req.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {req.term} meses
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {req.status}
                                                </span>
                                                {req.genesisId && (
                                                    <div className="text-xs text-gray-400 mt-1">Ref: {req.genesisId}</div>
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {/* Actions would go here, probably client components for interactivity */}
                                                <button className="text-indigo-600 hover:text-indigo-900">Gestionar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-500">No hay solicitudes de financiación.</td>
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
