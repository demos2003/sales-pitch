import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware for demonstration
// In a real app, you would verify JWT tokens or session cookies
export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated = request.cookies.has("auth_token")

  // Get user role
  const userRole = request.cookies.get("user_role")?.value || "founder"

  // Define protected routes
  const protectedRoutes = ["/projects", "/dashboard", "/create-project", "/profile"]

  // Define role-specific routes
  const founderOnlyRoutes = ["/create-project"]
  const creativeOnlyRoutes = [] // Add creative-only routes if needed

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Check if the route is restricted by role
  const isFounderRoute = founderOnlyRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isCreativeRoute = creativeOnlyRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If it's a protected route and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If it's a founder-only route and the user is not a founder, redirect to dashboard
  if (isAuthenticated && isFounderRoute && userRole !== "founder") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If it's a creative-only route and the user is not a creative, redirect to dashboard
  if (isAuthenticated && isCreativeRoute && userRole !== "creative") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/projects/:path*", "/dashboard/:path*", "/create-project/:path*", "/profile/:path*"],
}
