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

-- Create the function with a user_id check and safe parameter usage
CREATE OR REPLACE FUNCTION match_trained_documents (
  p_user_id uuid,
  p_query_embedding vector(1536),
  p_match_threshold double precision,
  p_match_count integer
)
RETURNS SETOF vector_store
LANGUAGE plpgsql
AS $$
BEGIN
  -- Enforce caller passes a user_id
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id must be provided';
  END IF;

  RETURN QUERY
  SELECT *
  FROM vector_store
  WHERE user_id = p_user_id
    AND vectors <=> p_query_embedding < 1 - p_match_threshold
  ORDER BY vectors <=> p_query_embedding ASC
  LIMIT LEAST(p_match_count, 200);
END;
$$;