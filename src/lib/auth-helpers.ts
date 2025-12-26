import { Session } from "next-auth"
import { cookies } from "next/headers"

/**
 * Returns the active dealership ID for the current session.
 * If the user is a Super Admin and has an impersonation cookie set, returns the cookie value.
 * Otherwise, returns the user's actual dealership ID.
 */
export async function getActiveDealershipId(session: Session | null): Promise<number | undefined> {
    if (!session) return undefined

    // 1. If Super Admin, allow Impersonation via Cookie
    // This allows a Super Admin linked to a verified Dealership to still switch views
    if (session.user.role === 'SUPER_ADMIN') {
        const cookieStore = await cookies()
        const impersonatedId = cookieStore.get('impersonate_dealership')?.value

        if (impersonatedId) {
            const parsedId = parseInt(impersonatedId, 10)
            return isNaN(parsedId) ? undefined : parsedId
        }
    }

    // 2. Default to session dealershipId (Own Dealership)
    // If not set (Global Admin), returns undefined (All Cars)
    return session.user.dealershipId || undefined
}
