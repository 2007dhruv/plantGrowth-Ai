-- Create comments table for post comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.comments enable row level security;

-- RLS Policies for comments
create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_own"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments_update_own"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_user_id_idx on public.comments(user_id);

-- Create trigger to update post comment count
create or replace function public.update_post_comments_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts
    set comments_count = comments_count + 1
    where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts
    set comments_count = comments_count - 1
    where id = OLD.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists update_comments_count on public.comments;

create trigger update_comments_count
  after insert or delete on public.comments
  for each row
  execute function public.update_post_comments_count();
