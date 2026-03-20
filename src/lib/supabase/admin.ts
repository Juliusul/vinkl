import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS. Nur server-side verwenden!
let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _admin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getAdmin()[prop as keyof SupabaseClient];
  },
});
