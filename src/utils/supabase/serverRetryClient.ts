"use server";

import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createRetryServerClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Only attempt to set cookies if we're in a server context
            if (typeof window === 'undefined') {
              cookieStore.set(name, value, options as any);
            }
          } catch (e: any) {
             // In Next.js Server Components, we cannot set cookies.
             // This is expected behavior when using createServerClient in a Server Component
             // vs a Server Action or Route Handler.
             // We suppress the error if it's the specific Next.js restriction.
            if (e?.message?.includes("Cookies can only be modified")) {
               return;
            }
            console.error("Error setting cookie:", e);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Only attempt to set cookies if we're in a server context
            if (typeof window === 'undefined') {
              cookieStore.set(name, '', { ...options, maxAge: 0 } as any);
            }
          } catch (e: any) {
            if (e?.message?.includes("Cookies can only be modified")) {
               return;
            }
            console.error("Error removing cookie:", e);
          }
        }
      }
    }
  );

  return supabase;
}
