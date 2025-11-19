-- I run this once inside Supabase SQL editor or via the CLI.
create extension if not exists "uuid-ossp";

create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  qr_source text not null,
  "timestamp" timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create index if not exists submissions_email_idx on public.submissions (email);
create index if not exists submissions_timestamp_idx on public.submissions ("timestamp");

