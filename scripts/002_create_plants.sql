-- Create plants table for user's plant collection
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  image_url text,
  identified_at timestamp with time zone,
  ai_confidence numeric(5,2),
  care_instructions text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.plants enable row level security;

-- RLS Policies for plants
create policy "plants_select_own"
  on public.plants for select
  using (auth.uid() = user_id);

create policy "plants_insert_own"
  on public.plants for insert
  with check (auth.uid() = user_id);

create policy "plants_update_own"
  on public.plants for update
  using (auth.uid() = user_id);

create policy "plants_delete_own"
  on public.plants for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists plants_user_id_idx on public.plants(user_id);
