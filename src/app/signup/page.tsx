import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

/*
 * Signup Page
 *
 * Creates new user accounts with email/password authentication.
 *
 * Signup Flow:
 * 1. User fills out form with email and password
 * 2. Form submits to signUp Server Action
 * 3. Supabase creates user and sends confirmation email
 * 4. User sees success message prompting them to check email
 * 5. User clicks link in email
 * 6. Supabase redirects to /auth/callback with auth code
 * 7. Callback route exchanges code for session
 * 8. User is redirected to dashboard
 *
 * Note: Email confirmation is enabled by default in Supabase.
 * This prevents spam accounts and validates email ownership.
 */
export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<SignupFormSkeleton />}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}

/*
 * Loading Skeleton
 *
 * Shown while the AuthForm component is loading.
 * Matches the approximate size of the form to prevent layout shift.
 */
function SignupFormSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="rounded-xl border bg-card p-6 shadow">
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-9 w-full rounded bg-muted" />
          </div>
          <div className="h-9 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
