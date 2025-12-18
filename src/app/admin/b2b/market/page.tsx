import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getMarketCars } from "@/app/actions/b2b"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { B2BManagementTab } from "@/components/admin/b2b/B2BManagementTab"
import { B2BMarketTab } from "@/components/admin/b2b/B2BMarketTab"
import { B2BLeadsTab } from "@/components/admin/b2b/B2BLeadsTab"

export default async function B2BMarketPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Allow if dealershipId exists OR if role is SUPER_ADMIN
    if (!session.user.dealershipId && session.user.role !== 'SUPER_ADMIN') {
        redirect('/login')
    }

    // Fetch market cars directly via server action/service
    const result = await getMarketCars(1)
    const marketCars = result.data

    // Check role
    const isSuperAdmin = session.user.role === 'SUPER_ADMIN'

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900">Mercado B2B</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Plataforma de compra-venta exclusiva para profesionales.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8">
                    <TabsTrigger value="buy">Comprar Coches</TabsTrigger>
                    {isSuperAdmin && <TabsTrigger value="sell">Mis Coches B2B</TabsTrigger>}
                    {isSuperAdmin && <TabsTrigger value="leads">Solicitudes / Leads</TabsTrigger>}
                </TabsList>

                <TabsContent value="buy">
                    {/* ... buy content ... */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        <h2 className="text-lg font-semibold text-primary mb-2">Oportunidades de Mercado</h2>
                        <p className="text-sm text-gray-600">
                            Vehículos de otros concesionarios disponibles para compra inmediata a precio profesional.
                        </p>
                    </div>
                    <B2BMarketTab cars={marketCars} />
                </TabsContent>

                {isSuperAdmin && (
                    <TabsContent value="sell">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                            <h2 className="text-lg font-semibold text-primary mb-2">Gestión de mi Inventario B2B</h2>
                            <p className="text-sm text-gray-600">
                                Selecciona vehículos de tu stock para publicarlos en el mercado B2B y establece un precio para profesionales.
                            </p>
                        </div>
                        <B2BManagementTab />
                    </TabsContent>
                )}

                {isSuperAdmin && (
                    <TabsContent value="leads">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                            <h2 className="text-lg font-semibold text-primary mb-2">Gestión de Solicitudes B2B</h2>
                            <p className="text-sm text-gray-600">
                                Gestiona las reservas y solicitudes de compra de otros profesionales sobre tus coches.
                            </p>
                        </div>
                        <B2BLeadsTab />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
