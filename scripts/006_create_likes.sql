-- Create likes table for post likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(post_id, user_id)
);

-- Enable RLS
alter table public.likes enable row level security;

-- RLS Policies for likes
create policy "likes_select_all"
  on public.likes for select
  using (true);

create policy "likes_insert_own"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "likes_delete_own"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists likes_post_id_idx on public.likes(post_id);
create index if not exists likes_user_id_idx on public.likes(user_id);

-- Create trigger to update post likes count
create or replace function public.update_post_likes_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts
    set likes_count = likes_count + 1
    where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts
    set likes_count = likes_count - 1
    where id = OLD.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists update_likes_count on public.likes;

create trigger update_likes_count
  after insert or delete on public.likes
  for each row
  execute function public.update_post_likes_count();
