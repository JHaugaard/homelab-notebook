import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/*
 * Next.js Middleware
 *
 * Middleware runs on EVERY matched request, before the request reaches
 * your page or API route. It's the perfect place to:
 * - Refresh authentication sessions
 * - Redirect based on auth state
 * - Add headers to responses
 * - Rewrite URLs
 *
 * This middleware delegates to our Supabase session handler,
 * which refreshes expired tokens and syncs cookies.
 *
 * When will this be extended?
 * In Step 6 (Authentication), we'll add route protection logic
 * to redirect unauthenticated users away from protected pages.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/*
 * Matcher Configuration
 *
 * This regex controls which routes the middleware runs on.
 * We EXCLUDE static files and images to improve performance.
 *
 * The pattern matches everything EXCEPT:
 * - /_next/static/* (Next.js static files)
 * - /_next/image/* (Next.js image optimization)
 * - /favicon.ico
 * - Common image/asset extensions (.svg, .png, .jpg, etc.)
 *
 * Why exclude these?
 * - Static assets don't need authentication
 * - Running middleware on every asset request hurts performance
 * - The Supabase session only matters for actual page/API requests
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - Common image/asset file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
