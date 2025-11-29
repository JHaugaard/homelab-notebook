import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/*
 * Browser Client for Supabase
 *
 * This client is used in CLIENT COMPONENTS (components with "use client").
 * It runs in the browser and uses cookies to manage the user session.
 *
 * When to use this client:
 * - Real-time subscriptions (Supabase Realtime)
 * - Client-side interactivity (forms, button clicks)
 * - Any component that uses React hooks (useState, useEffect)
 *
 * How it works:
 * - createBrowserClient() automatically handles cookie management
 * - Auth state persists across page refreshes
 * - Session is automatically refreshed when tokens expire
 *
 * Usage in a Client Component:
 *
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 *
 * export function MyComponent() {
 *   const supabase = createClient();
 *
 *   // Now you can use supabase.from(), supabase.auth, etc.
 *   const { data } = await supabase.from("notes").select();
 * }
 *
 * Note: This returns a new client instance each time. For performance,
 * consider using React's useMemo or a singleton pattern if you're
 * making many calls in rapid succession.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
