import { useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../utils/supabase';

let cachedClient: SupabaseClient | null = null;

/**
 * Hook to get the raw Supabase client for advanced operations.
 * For common operations like adding/fetching submissions, use useSupabase() instead.
 */
export function useSupabaseClient() {
  const client = useMemo(() => {
    if (cachedClient) {
      return cachedClient;
    }

    try {
      cachedClient = getSupabaseClient();
      return cachedClient;
    } catch (error) {
      console.warn('Unable to initialize Supabase client', error);
      return null;
    }
  }, []);

  return client;
}
