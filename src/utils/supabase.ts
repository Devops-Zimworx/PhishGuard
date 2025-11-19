import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnv();

  console.info("[supabase] I am creating the shared Supabase client.");
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}
