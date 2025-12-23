import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CarService } from "@/services/car-service"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getActiveDealershipId } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import InventoryFinancingTable from "../components/InventoryFinancingTable"
import InventoryTabs from "../components/InventoryTabs"

export const dynamic = 'force-dynamic'

export default async function InventoryFinancingPage() {
    const session = await getServerSession(authOptions)

    if (!session || (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN')) {
        if (session?.user?.role !== 'SUPER_ADMIN') {
            redirect('/login')
        }
    }

    const dealershipId = await getActiveDealershipId(session)

    // Check permissions
    const dealership = dealershipId ? await prisma.dealership.findUnique({
        where: { id: dealershipId },
        select: {
            financingEnabled: true,
            usePlatformFinancing: true,
            enableWithInsurance: true,
            enableWithoutInsurance: true,
            enabledFinancialEntities: {
                select: { id: true, name: true, code: true }
            },
            enabledInterestRates: {
                select: { id: true, name: true, value: true }
            }
        }
    }) : null

    // Access Control
    if (!dealership?.financingEnabled) {
        redirect('/admin/inventory')
    }

    // Fetch data specifically for Financing Table (ALL published cars)
    const carService = new CarService()
    const result = await carService.getAdminInventory({
        page: 1,
        limit: 100, // Fetch a larger batch for the financing table
        // We ideally want ALL cars to manage financing, or pagination. 
        // For now lets keep 100 which is reasonable for most dealers.
        status: undefined, // Relaxed status to see everything
        dealershipId
    })

    // @ts-ignore
    const cars = result.data

    // Serialize data for Client Component
    const serializedRates = dealership?.enabledInterestRates.map(rate => ({
        ...rate,
        value: Number(rate.value)
    })) || []

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Gestor de Financiación</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Configura las cuotas y opciones de financiación para tu stock.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-3">
                    <InventoryTabs showFinancing={true} />
                    <Link
                        href="/admin/sync"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Importar XML
                    </Link>
                </div>
            </div>

            <InventoryFinancingTable
                cars={cars}
                dealershipId={dealershipId!}
                permissions={{
                    enableWithInsurance: dealership?.enableWithInsurance ?? false,
                    enableWithoutInsurance: dealership?.enableWithoutInsurance ?? false
                }}
                enabledEntities={dealership?.enabledFinancialEntities || []}
                enabledRates={serializedRates}
            />
        </div>
    )
}
