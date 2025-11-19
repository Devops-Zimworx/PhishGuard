type EnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY';

type EnvShape = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

let cachedEnv: EnvShape | null = null;

function readRequiredEnv(key: EnvKey): string {
  const value = import.meta.env[key] as string | undefined;

  if (!value || !value.trim()) {
    console.error(`[env] I expected ${key} to be defined, but it was missing or empty.`);
    throw new Error(`Missing required env: ${key}`);
  }

  return value;
}

export function getEnv(): EnvShape {
  if (cachedEnv) {
    return cachedEnv;
  }

  const SUPABASE_URL = readRequiredEnv('VITE_SUPABASE_URL');
  const SUPABASE_ANON_KEY = readRequiredEnv('VITE_SUPABASE_ANON_KEY');

  cachedEnv = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  };

  console.info('[env] I validated Supabase environment variables.');

  return cachedEnv;
}

