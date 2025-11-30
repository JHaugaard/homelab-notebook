"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

/*
 * Sign Out Button Component
 *
 * A simple client component that triggers the signOut Server Action.
 *
 * Why a Client Component?
 * - We need to handle the form submission interactively
 * - Could show loading state if needed (not implemented here for simplicity)
 *
 * Using a form with Server Action:
 * - More reliable than onClick with fetch
 * - Works even if JavaScript fails to load
 * - Follows progressive enhancement principles
 */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">
        Sign out
      </Button>
    </form>
  );
}
