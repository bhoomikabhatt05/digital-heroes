// Server-only privileged client — never import in client components
// Uses SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY fallback) for admin/bypass RLS operations
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
  // Prefer SUPABASE_SECRET_KEY per spec, fallback to SERVICE_ROLE for compatibility
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isServiceConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}
