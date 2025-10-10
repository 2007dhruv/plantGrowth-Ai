-- Create health_checks table for plant disease detection
create table if not exists public.health_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references public.plants(id) on delete set null,
  image_url text not null,
  disease_detected text,
  confidence numeric(5,2),
  severity text check (severity in ('mild', 'moderate', 'severe')),
  recovery_plan text,
  status text default 'pending' check (status in ('pending', 'analyzed', 'recovering', 'recovered')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.health_checks enable row level security;

-- RLS Policies for health_checks
create policy "health_checks_select_own"
  on public.health_checks for select
  using (auth.uid() = user_id);

create policy "health_checks_insert_own"
  on public.health_checks for insert
  with check (auth.uid() = user_id);

create policy "health_checks_update_own"
  on public.health_checks for update
  using (auth.uid() = user_id);

create policy "health_checks_delete_own"
  on public.health_checks for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists health_checks_user_id_idx on public.health_checks(user_id);
create index if not exists health_checks_plant_id_idx on public.health_checks(plant_id);
