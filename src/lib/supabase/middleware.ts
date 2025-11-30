import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/*
 * Route Configuration
 *
 * Define which routes require authentication and which are public.
 * This centralized configuration makes it easy to manage access control.
 */

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/research",
  "/project",
  "/reference",
  "/notes",
  "/settings",
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/signup"];

// Routes that are always public (no redirect logic)
// Note: These are implicitly public - any route not in PROTECTED_ROUTES or AUTH_ROUTES
// is allowed without authentication. This list is kept for documentation purposes.
const _PUBLIC_ROUTES = ["/", "/auth/callback"];

/*
 * Supabase Middleware Client
 *
 * This creates a Supabase client specifically for use in Next.js middleware.
 * Middleware runs on EVERY request before it reaches your pages/API routes.
 *
 * Why middleware is essential for Supabase Auth:
 * 1. Session Refresh: JWT tokens expire. Middleware refreshes them automatically
 * 2. Cookie Sync: Keeps auth cookies synchronized between request/response
 * 3. Protection: Can redirect unauthenticated users before page loads
 *
 * How the cookie handling works:
 * - getAll(): Reads cookies from the incoming request
 * - setAll(): Updates cookies on BOTH the request AND response
 *   - Request cookies: So Server Components see the refreshed session
 *   - Response cookies: So the browser stores the new tokens
 *
 * CRITICAL: Do not add code between createServerClient and getUser()
 * The client must immediately validate the session after creation.
 */
export async function updateSession(request: NextRequest) {
  // Start with a "pass-through" response that continues to the destination
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First, update the request cookies (for downstream Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Create a new response with the updated request
          supabaseResponse = NextResponse.next({
            request,
          });

          // Then set the cookies on the response (for the browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /*
   * IMPORTANT: Do not add any code between createServerClient and getUser()
   *
   * Why getUser() and not getSession()?
   * - getUser() validates the JWT against Supabase's servers
   * - getSession() only reads the local cookie without validation
   * - Never trust getSession() on the server for security
   *
   * This call also triggers session refresh if tokens are expired
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /*
   * Route Protection Logic
   *
   * This implements a simple but effective auth flow:
   *
   * 1. Protected Routes (/dashboard, /notes, etc.)
   *    - If not logged in → redirect to /login
   *    - If logged in → allow access
   *
   * 2. Auth Routes (/login, /signup)
   *    - If logged in → redirect to /dashboard (already authenticated)
   *    - If not logged in → allow access (let them authenticate)
   *
   * 3. Public Routes (/, /auth/callback)
   *    - Always allow access regardless of auth state
   *
   * Why check routes this way?
   * - Using startsWith() allows for nested routes (e.g., /dashboard/settings)
   * - The order matters: check protected first, then auth, then allow all else
   */

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is an auth route (login/signup)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL so we can redirect back after login
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
