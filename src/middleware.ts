import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Check if user is authenticated
      if (!token) return false

      // Admin routes require role check if needed
      if (req.nextUrl.pathname.startsWith('/admin')) {
        // Allow SUPER_ADMIN and DEALERSHIP_ADMIN
        return ['SUPER_ADMIN', 'DEALERSHIP_ADMIN', 'ADMIN'].includes(token.role as string)
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/admin/:path*']
}
