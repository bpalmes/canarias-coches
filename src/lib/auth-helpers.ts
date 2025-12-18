import { Session } from "next-auth"
import { cookies } from "next/headers"

/**
 * Returns the active dealership ID for the current session.
 * If the user is a Super Admin and has an impersonation cookie set, returns the cookie value.
 * Otherwise, returns the user's actual dealership ID.
 */
export async function getActiveDealershipId(session: Session | null): Promise<number | undefined> {
    if (!session) return undefined

    // If user is NOT a regular dealer (i.e., Super Admin), check for impersonation cookie
    if (!session.user.dealershipId) {
        const cookieStore = await cookies()
        const impersonatedId = cookieStore.get('impersonate_dealership')?.value

        if (impersonatedId) {
            const parsedId = parseInt(impersonatedId, 10)
            return isNaN(parsedId) ? undefined : parsedId
        }
    }

    // Default to session dealershipId
    return session.user.dealershipId || undefined
}
