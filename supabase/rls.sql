-- I enable RLS and scope anonymous clients to inserts only.
alter table public.submissions enable row level security;

create policy if not exists "Allow anonymous inserts" on public.submissions
for insert
to anon
with check (true);

create policy if not exists "Service role full access" on public.submissions
for all
to service_role
using (true)
with check (true);

