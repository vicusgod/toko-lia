import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { hasAccess, UserRole } from "@/lib/auth/roles"

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isPendingRoute = createRouteMatcher(['/pending'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const pathname = req.nextUrl.pathname

  // Protected routes require authentication
  if (isProtectedRoute(req) || isPendingRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // Fetch user to get role
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const role = user.publicMetadata?.role as UserRole | undefined

    // No role = pending user
    if (!role) {
      if (!isPendingRoute(req)) {
        return NextResponse.redirect(new URL('/pending', req.url))
      }
      return NextResponse.next()
    }

    // Has role but on pending page = redirect to dashboard
    if (isPendingRoute(req)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check route access
    if (isProtectedRoute(req) && !hasAccess(role, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/webhooks).*)",
    "/(api|trpc)(.*)",
  ],
}
