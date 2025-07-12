create table if not exists public.users (
  id uuid primary key default gen_random_uuid() not null,
  username text not null,
  credits_available integer not null default 100,
  credits_used integer not null default 0,
  files_available integer not null default 1,
  files_used integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists users_username_idx on public.users (username);
create index if not exists users_credits_available_idx on public.users (credits_available);
create index if not exists users_credits_used_idx on public.users (credits_used);
create index if not exists users_files_available_idx on public.users (files_available);
create index if not exists users_files_used_idx on public.users (files_used);
