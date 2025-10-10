-- Create posts table for community feed
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  image_url text,
  plant_id uuid references public.plants(id) on delete set null,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.posts enable row level security;

-- RLS Policies for posts - everyone can view, only owner can modify
create policy "posts_select_all"
  on public.posts for select
  using (true);

create policy "posts_insert_own"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "posts_update_own"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "posts_delete_own"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Create index
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_user_id_idx on public.posts(user_id);
