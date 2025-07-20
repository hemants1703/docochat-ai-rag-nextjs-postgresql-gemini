create table if not exists chats_store (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  role text not null,
  message text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists chats_store_user_id_idx on chats_store (user_id);
create index if not exists chats_store_created_at_idx on chats_store (created_at);
create index if not exists chats_store_updated_at_idx on chats_store (updated_at);