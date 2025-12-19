import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CarService } from "@/services/car-service"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getActiveDealershipId } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export default async function AdminInventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions)
    const resolvedSearchParams = await searchParams

    if (!session || !session.user.dealershipId) {
        // Allow Super Admin to pass through even without dealershipId
        if (session?.user?.role !== 'SUPER_ADMIN') {
            redirect('/login')
        }
    }

    const carService = new CarService()

    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1
    const search = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined
    const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined

    // Use helper to support impersonation
    const dealershipId = await getActiveDealershipId(session)

    const result = await carService.getAdminInventory({
        page,
        limit: 20,
        query: search,
        status: status,
        dealershipId
    })

    // @ts-ignore
    const cars = result.data
    const meta = result.meta

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Gestor de Inventario</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {session.user.role === 'SUPER_ADMIN' ? 'Gestión global de stock.' : 'Gestiona tus vehículos.'}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-3">
                    <Link
                        href="/admin/sync"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Importar XML
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap gap-4 bg-white p-4 rounded-md shadow-sm">
                <form className="flex-1 flex gap-4">
                    <input
                        name="q"
                        defaultValue={search}
                        placeholder="Buscar por nombre, SKU, marca..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                    />
                    <select
                        name="status"
                        defaultValue={status}
                        className="rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                    >
                        <option value="">Todos los estados</option>
                        <option value="PUBLISHED">Publicados</option>
                        <option value="DRAFT">Borradores</option>
                        <option value="SOLD">Vendidos</option>
                        <option value="RESERVED">Reservados</option>
                    </select>
                    <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                        Filtrar
                    </button>
                    {(search || status) && (
                        <Link href="/admin/inventory" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                            Reset
                        </Link>
                    )}
                </form>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Vehículo</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Precio</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Concesionario</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Última act.</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {cars.map((car: any) => (
                                        <tr key={car.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {car.images?.[0]?.url ? (
                                                            <img className="h-10 w-10 rounded-full object-cover" src={car.images[0].url} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {car.make?.name} {car.model?.name}
                                                        </div>
                                                        <div className="text-gray-500">{car.version} (Ref: {car.sku})</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                                ${car.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {car.status}
                                                </span>
                                                {car.isB2BAvailable && (
                                                    <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                                        B2B
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {car.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {car.dealership?.name || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Date(car.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link href={`/inventory/${car.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                    Ver
                                                </Link>
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination (Simple) */}
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
                            <div>
                                Total: {meta.total} vehículos
                            </div>
                            <div className="flex gap-2">
                                {page > 1 && (
                                    <Link href={`/admin/inventory?page=${page - 1}`} className="px-3 py-1 border rounded hover:bg-gray-50">
                                        Anterior
                                    </Link>
                                )}
                                {page < meta.lastPage && (
                                    <Link href={`/admin/inventory?page=${page + 1}`} className="px-3 py-1 border rounded hover:bg-gray-50">
                                        Siguiente
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
