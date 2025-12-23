import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getActiveDealershipId } from "@/lib/auth-helpers"

export default async function ProductsManagementPage() {
    const session = await getServerSession(authOptions)
    const activeDealershipId = await getActiveDealershipId(session)
    const isImpersonating = session?.user.role === 'SUPER_ADMIN' && !!activeDealershipId;

    if (!session || session.user.role !== 'SUPER_ADMIN' || isImpersonating) {
        redirect('/admin')
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Gestionar Productos</h1>
            <p className="mt-4">Próximamente...</p>
        </div>
    )
}
