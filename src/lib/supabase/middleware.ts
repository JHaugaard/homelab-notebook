import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

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
  // Refresh the session - this triggers token refresh if needed
  // We intentionally ignore the result for now; route protection comes in Step 6
  await supabase.auth.getUser();

  /*
   * Protected Routes Logic (Step 6)
   *
   * When implementing auth, you'll add logic like:
   *
   * const { data: { user } } = await supabase.auth.getUser();
   * const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
   *
   * if (isProtectedRoute && !user) {
   *   return NextResponse.redirect(new URL("/login", request.url));
   * }
   */

  return supabaseResponse;
}
