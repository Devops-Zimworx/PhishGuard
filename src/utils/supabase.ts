import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}. Please add it to .env.local.`);
  }
  return value;
}

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = assertEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL as string | undefined);
  const anonKey = assertEnv('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

  // TODO: I plan to inject service role keys from server-side contexts when we add admin APIs.
  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}
