-- ============================================================
-- Migration: Create psikotes tables with RLS
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. profiles
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. test_sessions
-- ============================================================
create table public.test_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  test_type text not null check (test_type in ('kraepelin', 'pauli')),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  seed integer not null,
  config_snapshot jsonb not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.test_sessions enable row level security;

create policy "Users can view own sessions"
  on public.test_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.test_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.test_sessions for update
  using (auth.uid() = user_id);

create index idx_test_sessions_user_id on public.test_sessions (user_id);
create index idx_test_sessions_status on public.test_sessions (status);

-- ============================================================
-- 3. column_results
-- ============================================================
create table public.column_results (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.test_sessions on delete cascade not null,
  column_index integer not null,
  rows_answered integer not null default 0,
  correct integer not null default 0,
  wrong integer not null default 0,
  skipped integer not null default 0,
  duration_ms integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  unique (session_id, column_index)
);

alter table public.column_results enable row level security;

create policy "Users can view own column results"
  on public.column_results for select
  using (
    exists (
      select 1 from public.test_sessions
      where test_sessions.id = column_results.session_id
        and test_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert own column results"
  on public.column_results for insert
  with check (
    exists (
      select 1 from public.test_sessions
      where test_sessions.id = column_results.session_id
        and test_sessions.user_id = auth.uid()
    )
  );

create index idx_column_results_session_id on public.column_results (session_id);

-- ============================================================
-- 4. test_analyses
-- ============================================================
create table public.test_analyses (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.test_sessions on delete cascade not null unique,
  metrics jsonb not null,
  categories jsonb not null,
  summary text not null default '',
  created_at timestamptz not null default now()
);

alter table public.test_analyses enable row level security;

create policy "Users can view own analyses"
  on public.test_analyses for select
  using (
    exists (
      select 1 from public.test_sessions
      where test_sessions.id = test_analyses.session_id
        and test_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert own analyses"
  on public.test_analyses for insert
  with check (
    exists (
      select 1 from public.test_sessions
      where test_sessions.id = test_analyses.session_id
        and test_sessions.user_id = auth.uid()
    )
  );

create index idx_test_analyses_session_id on public.test_analyses (session_id);
