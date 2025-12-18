import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name?: string | null
            role: string
            dealershipId?: number | null
        }
    }

    interface User {
        id: string
        role: string
        dealershipId?: number | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string
        dealershipId?: number | null
    }
}
