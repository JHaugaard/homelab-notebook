import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/actions";
import { MainNav } from "@/components/navigation";

/*
 * Authenticated Layout
 *
 * This layout wraps all protected routes (dashboard, notes, modes).
 * It provides:
 * - Authentication check (redirects to login if not authenticated)
 * - Shared navigation across all authenticated pages
 * - Consistent page structure
 *
 * Route Groups in Next.js App Router:
 * - Folders wrapped in parentheses (auth) don't affect the URL
 * - /dashboard stays /dashboard, not /(auth)/dashboard
 * - This lets us share layouts without changing URLs
 *
 * Why check auth here?
 * - Middleware provides the first line of defense
 * - This layout provides defense-in-depth
 * - If middleware fails, pages still won't render protected content
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav userEmail={user.email || "User"} />
      <main>{children}</main>
    </div>
  );
}
