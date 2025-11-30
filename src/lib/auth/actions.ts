"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/*
 * Server Actions for Authentication
 *
 * Server Actions are async functions that run on the server, triggered by
 * form submissions or client-side calls. They're the modern replacement for
 * API routes for mutations in Next.js 15.
 *
 * Why Server Actions for auth?
 * - No need to create separate API routes
 * - Automatic request/response handling
 * - Can redirect and revalidate directly
 * - Type-safe with TypeScript
 *
 * Security Note:
 * - Always validate input on the server (never trust client data)
 * - Use the server Supabase client (validates cookies server-side)
 */

// ============================================================================
// Types
// ============================================================================

export interface AuthResult {
  error?: string;
  success?: boolean;
}

// ============================================================================
// Sign Up
// ============================================================================

/*
 * Sign up with email and password
 *
 * Flow:
 * 1. User submits signup form
 * 2. Supabase creates user and sends confirmation email
 * 3. User clicks link in email
 * 4. Supabase redirects to /auth/callback with tokens
 * 5. Callback route exchanges tokens for session
 * 6. User is redirected to app
 *
 * Note: Email confirmation is enabled by default in Supabase.
 * Users can't log in until they confirm their email.
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      /*
       * emailRedirectTo: Where Supabase sends users after clicking the
       * confirmation link in their email. This must be an absolute URL.
       *
       * The /auth/callback route will handle exchanging the code for a session.
       */
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Don't redirect here - let the form handle showing a success message
  // telling the user to check their email
  return { success: true };
}

// ============================================================================
// Sign In
// ============================================================================

/*
 * Sign in with email and password
 *
 * Flow:
 * 1. User submits login form
 * 2. Supabase validates credentials
 * 3. On success, session cookies are set automatically
 * 4. User is redirected to the dashboard
 *
 * The redirect happens via the redirect() function from next/navigation,
 * which throws a NEXT_REDIRECT error. This is intentional and handled by Next.js.
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Revalidate cached data and redirect to dashboard
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ============================================================================
// Sign Out
// ============================================================================

/*
 * Sign out the current user
 *
 * This clears the session from both:
 * - Supabase's backend (invalidates the refresh token)
 * - Browser cookies (via the server client)
 *
 * After sign out, the user is redirected to the login page.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

// ============================================================================
// Get Current User (Helper)
// ============================================================================

/*
 * Get the current authenticated user
 *
 * This is a helper for use in Server Components and Server Actions.
 * Returns null if not authenticated.
 *
 * IMPORTANT: Always use getUser() instead of getSession() on the server.
 * - getUser() validates the JWT against Supabase's servers
 * - getSession() only reads the local cookie without validation
 *
 * Security: Never trust getSession() for authorization decisions.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
