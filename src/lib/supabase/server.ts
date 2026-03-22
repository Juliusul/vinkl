import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Minimal stub returned when Supabase env vars are not set (e.g. during build/preview)
function makeStubClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      verifyOtp: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
      exchangeCodeForSession: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
      signInWithPassword: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
      updateUser: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
    },
  } as unknown as SupabaseClient;
}

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return makeStubClient();

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookie-writes werden ignoriert
        }
      },
    },
  });
}
