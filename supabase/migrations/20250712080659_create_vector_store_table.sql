create table if not exists vector_store (
  id uuid primary key default gen_random_uuid() not null,
  user_id uuid not null references public.users(id),
  content text not null,
  vectors vector(1536) not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);


-- These statements create indexes on the 'vector_store' table to improve query performance:
-- 1. 'vector_store_user_id_idx' on the 'user_id' column, speeding up queries filtering by user.
-- 2. 'vector_store_created_at_idx' on the 'created_at' column, optimizing queries sorted or filtered by creation time.
-- 3. 'vector_store_updated_at_idx' on the 'updated_at' column, optimizing queries sorted or filtered by update time.

create index if not exists vector_store_user_id_idx on vector_store (user_id);
create index if not exists vector_store_created_at_idx on vector_store (created_at);
create index if not exists vector_store_updated_at_idx on vector_store (updated_at);