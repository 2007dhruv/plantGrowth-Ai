-- Create diseases table for disease library
create table if not exists public.diseases (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  scientific_name text,
  description text not null,
  symptoms text[] not null,
  causes text[] not null,
  treatment text not null,
  prevention text,
  affected_plants text[],
  severity text check (severity in ('mild', 'moderate', 'severe')),
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS - everyone can read diseases
alter table public.diseases enable row level security;

create policy "diseases_select_all"
  on public.diseases for select
  using (true);

-- Create index for search
create index if not exists diseases_name_idx on public.diseases using gin(to_tsvector('english', name));
create index if not exists diseases_description_idx on public.diseases using gin(to_tsvector('english', description));
