create table if not exists vector_store (
  id uuid primary key default gen_random_uuid() not null,
  user_id uuid not null references public.users(id),
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  file_content text not null,
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

-- Match documents using cosine distance (<=>) [Semantic Search Match Function for PostgreSQL in Supabase]
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns setof vector_store
language sql
as $$
  select *
  from vector_store
  where vector_store.vectors <=> query_embedding < 1 - match_threshold
  order by vector_store.vectors <=> query_embedding asc
  limit least(match_count, 200);
$$;