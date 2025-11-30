import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/*
 * Auth Callback Route Handler
 *
 * This route handles the OAuth/email confirmation callback from Supabase.
 * When a user clicks the confirmation link in their email, Supabase redirects
 * them here with an authorization code.
 *
 * How the Email Confirmation Flow Works:
 *
 * 1. User signs up with email/password
 * 2. Supabase sends a confirmation email with a link like:
 *    https://yourapp.com/auth/callback?code=xxx&next=/dashboard
 *
 * 3. User clicks the link, browser hits THIS route
 *
 * 4. We extract the code from the URL and exchange it for a session:
 *    - code → access_token + refresh_token
 *    - Tokens are stored in cookies automatically
 *
 * 5. User is redirected to the app (now authenticated)
 *
 * PKCE (Proof Key for Code Exchange):
 * Supabase uses PKCE for security. The code can only be exchanged once
 * and must be exchanged by the same browser that initiated the auth flow.
 * This prevents auth code interception attacks.
 *
 * Why a Route Handler instead of a page?
 * - We only need to process the code and redirect
 * - No UI needed - it's a quick server-side operation
 * - Route handlers are lighter weight than pages
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  // Extract the authorization code from the URL
  const code = requestUrl.searchParams.get("code");

  // Get the redirect destination (defaults to dashboard)
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();

    /*
     * Exchange the code for a session
     *
     * This is the PKCE code exchange. Supabase validates that:
     * 1. The code is valid and hasn't been used
     * 2. The code_verifier matches the code_challenge from signup
     *
     * On success, the session tokens are automatically stored in cookies
     * by the Supabase server client.
     */
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success! Redirect to the intended destination
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    /*
     * Error Handling
     *
     * Common errors:
     * - Code expired (confirmation links expire after 24h by default)
     * - Code already used (links are single-use)
     * - Invalid code (tampering or corruption)
     *
     * We redirect to login with an error message rather than showing
     * an error page, so users can easily try again.
     */
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    );
  }

  /*
   * No Code Provided
   *
   * This shouldn't happen in normal flows. Could be:
   * - Direct navigation to /auth/callback
   * - Corrupted/incomplete email link
   *
   * Redirect to login as a safe fallback.
   */
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
