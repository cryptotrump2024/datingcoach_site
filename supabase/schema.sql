-- DatingCoach database schema (idempotent — safe to re-run)
-- Apply with: cd app && npm run apply-schema
-- or paste into Supabase Dashboard → SQL Editor → Run.

-- ── Profiles ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null default 'Member',
  plan text not null default 'free' check (plan in ('free', 'pro', 'advanced')),
  credits integer not null default 3,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup (username from auth metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Conversations (client-generated ids) ──────────────────────────────────
create table if not exists public.conversations (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  persona jsonb not null,
  messages jsonb not null default '[]'::jsonb,
  analyses jsonb not null default '[]'::jsonb,
  phase integer not null default 0,
  phase_name text not null default 'Opener',
  is_active boolean not null default false,
  scenario_slug text,
  avg_score numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_user_created_idx
  on public.conversations (user_id, created_at desc);

alter table public.conversations enable row level security;

drop policy if exists "conversations_all_own" on public.conversations;
create policy "conversations_all_own" on public.conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Profile analyses ───────────────────────────────────────────────────────
create table if not exists public.profile_analyses (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists profile_analyses_user_idx
  on public.profile_analyses (user_id, created_at desc);

alter table public.profile_analyses enable row level security;

drop policy if exists "profile_analyses_all_own" on public.profile_analyses;
create policy "profile_analyses_all_own" on public.profile_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Practice progress (gamification) ──────────────────────────────────────
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  last_practice_date text,
  achievements jsonb not null default '[]'::jsonb,
  drills jsonb not null default '{}'::jsonb,
  voice_used boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "user_progress_all_own" on public.user_progress;
create policy "user_progress_all_own" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
