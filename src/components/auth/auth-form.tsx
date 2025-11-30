"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signUp, type AuthResult } from "@/lib/auth/actions";

/*
 * Auth Form Component
 *
 * A reusable form for both login and signup pages.
 * This is a CLIENT component because it needs:
 * - useState for form state and error handling
 * - useRouter for navigation after signup success
 * - useSearchParams to read the redirectTo parameter
 *
 * Why a shared component?
 * - Login and signup forms are nearly identical
 * - Reduces code duplication
 * - Ensures consistent styling and behavior
 *
 * Form Submission Pattern:
 * We use Server Actions for form submission. The action is called directly
 * from the form, and we handle the result in a wrapper function to manage
 * loading states and error display.
 */

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get the redirect URL from query params (set by middleware when redirecting from protected routes)
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome back" : "Create an account";
  const description = isLogin
    ? "Enter your credentials to access your notebook"
    : "Enter your email to create your account";
  const buttonText = isLogin ? "Sign in" : "Sign up";
  const altText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const altLinkText = isLogin ? "Sign up" : "Sign in";

  /*
   * Form Submission Handler
   *
   * This wraps the Server Action to add client-side state management.
   * The actual authentication happens server-side via the action.
   *
   * Why not just use action={} directly?
   * - We need to show loading states
   * - We need to display errors returned from the server
   * - For signup, we need to show a success message instead of redirecting
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const action = isLogin ? signIn : signUp;
      const result: AuthResult = await action(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // For signup, show success message (user needs to confirm email)
      if (!isLogin && result.success) {
        setSuccessMessage(
          "Check your email! We sent you a confirmation link. Click it to activate your account."
        );
        return;
      }

      // For login, the signIn action handles the redirect via redirect()
      // If we reach here, something went wrong
    } catch (err) {
      /*
       * NEXT_REDIRECT Error
       *
       * When a Server Action calls redirect(), Next.js throws a special
       * NEXT_REDIRECT error. This is intentional and not an actual error.
       * We catch it here to prevent showing an error message.
       *
       * The redirect will still happen - this catch is just to prevent
       * our error handling from triggering.
       */
      if (
        err instanceof Error &&
        err.message.includes("NEXT_REDIRECT")
      ) {
        // This is expected - redirect is happening
        return;
      }
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Success Message (for signup) */}
          {successMessage && (
            <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading || !!successMessage}
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
              required
              minLength={6}
              disabled={isLoading || !!successMessage}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          {/* Hidden field to pass redirectTo to the server action */}
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? "Loading..." : buttonText}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {altText}{" "}
            <Link
              href={(isLogin ? "/signup" : "/login") as Route}
              className="text-primary underline-offset-4 hover:underline"
            >
              {altLinkText}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
