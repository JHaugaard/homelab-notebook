import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

/*
 * Login Page
 *
 * This is a Server Component that renders the login form.
 * The actual form logic is in a Client Component (AuthForm).
 *
 * Why the Suspense boundary?
 * AuthForm uses useSearchParams() which requires being wrapped in Suspense.
 * This is a Next.js 15 requirement for Client Components that read
 * search params during server-side rendering.
 *
 * Page Structure:
 * - Full-height centered layout
 * - Card-based form for visual prominence
 * - Link to signup for new users
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<LoginFormSkeleton />}>
        <AuthForm mode="login" />
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
function LoginFormSkeleton() {
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
