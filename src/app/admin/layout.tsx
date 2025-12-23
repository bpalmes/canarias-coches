// (no auth logic here; middleware handles it)

import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getActiveDealershipId } from "@/lib/auth-helpers"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = !session?.user?.dealershipId
  const activeDealershipId = await getActiveDealershipId(session)

  // If isSuperAdmin is true, activeDealershipId will be the cookie value (impersonated ID) OR undefined.
  // If we are impersonating, activeDealershipId has a value.
  const isImpersonating = isSuperAdmin && !!activeDealershipId

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar isSuperAdmin={isSuperAdmin} isImpersonating={isImpersonating} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminHeader
          isSuperAdmin={isSuperAdmin}
          impersonatedId={activeDealershipId}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
