import { useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../utils/supabase';

let cachedClient: SupabaseClient | null = null;

export function useSupabase() {
  const client = useMemo(() => {
    if (cachedClient) {
      return cachedClient;
    }

    try {
      cachedClient = getSupabaseClient();
      return cachedClient;
    } catch (error) {
      // TODO: I will bubble this up through an error boundary later.
      console.warn('Unable to initialize Supabase client', error);
      return null;
    }
  }, []);

  return client;
}
