import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/*
 * Server Client for Supabase
 *
 * This client is used in SERVER COMPONENTS, Server Actions, and Route Handlers.
 * It runs on the server and uses Next.js cookies() for session management.
 *
 * When to use this client:
 * - Server Components (default in App Router)
 * - Server Actions (form submissions, mutations)
 * - API Route Handlers (GET, POST, etc.)
 *
 * How it works:
 * - The function is async because cookies() is async in Next.js 15
 * - getAll() reads cookies from the incoming request
 * - setAll() writes cookies to the response (for session refresh)
 * - The try/catch in setAll() handles Server Components where cookies are read-only
 *
 * IMPORTANT - Cookie Methods:
 * - ALWAYS use getAll() and setAll() - these are the only supported methods
 * - NEVER use get(), set(), or remove() - they don't work with @supabase/ssr
 *
 * Usage in a Server Component:
 *
 * import { createClient } from "@/lib/supabase/server";
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from("notes").select();
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 *
 * Usage in a Server Action:
 *
 * "use server";
 * import { createClient } from "@/lib/supabase/server";
 *
 * export async function createNote(formData: FormData) {
 *   const supabase = await createClient();
 *   const { data, error } = await supabase
 *     .from("notes")
 *     .insert({ title: formData.get("title") });
 *   return { data, error };
 * }
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /*
         * getAll() - Read all cookies from the request
         * Used to retrieve the user's session token
         */
        getAll() {
          return cookieStore.getAll();
        },

        /*
         * setAll() - Write cookies to the response
         * Used when the session is refreshed or user signs in/out
         *
         * The try/catch is necessary because:
         * - In Server Components, cookies are read-only (can't modify response)
         * - This is fine if middleware handles session refresh (which we do)
         * - In Server Actions/Route Handlers, this will work normally
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component - middleware handles session refresh
            // This can be safely ignored
          }
        },
      },
    }
  );
}
