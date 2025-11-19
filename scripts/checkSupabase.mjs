#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

function readEnv(key) {
  const value = process.env[key] ?? process.env[`VITE_${key}`];

  if (!value || !value.trim()) {
    console.error(`[check-supabase] I expected ${key} to be defined before running this check.`);
    process.exitCode = 1;
  }

  return value;
}

async function main() {
  console.info('[check-supabase] I am attempting to connect to Supabase...');
  const SUPABASE_URL = readEnv('SUPABASE_URL');
  const SUPABASE_ANON_KEY = readEnv('SUPABASE_ANON_KEY');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing credentials for Supabase check.');
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await client.from('submissions').select('id').limit(1);

  if (error) {
    console.error('[check-supabase] I was unable to query the submissions table:', error.message);
    process.exit(1);
  }

  console.info('[check-supabase] I successfully queried the submissions table.');
}

main().catch((error) => {
  console.error('[check-supabase] I hit an unexpected error while talking to Supabase.', error);
  process.exit(1);
});

