type EnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY' | 'VITE_ADMIN_PASSWORD';

type EnvShape = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  ADMIN_PASSWORD?: string;
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

function readOptionalEnv(key: 'VITE_ADMIN_PASSWORD'): string | undefined {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim() ? value.trim() : undefined;
}

export function getEnv(): EnvShape {
  if (cachedEnv) {
    return cachedEnv;
  }

  const SUPABASE_URL = readRequiredEnv('VITE_SUPABASE_URL');
  const SUPABASE_ANON_KEY = readRequiredEnv('VITE_SUPABASE_ANON_KEY');
  const ADMIN_PASSWORD = readOptionalEnv('VITE_ADMIN_PASSWORD');

  cachedEnv = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    ADMIN_PASSWORD,
  };

  console.info('[env] I validated Supabase environment variables.');
  if (ADMIN_PASSWORD) {
    console.info('[env] I found admin password configuration.');
  }

  return cachedEnv;
}

