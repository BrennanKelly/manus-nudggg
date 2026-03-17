-- Nudggg Database Schema
-- Run this in the Supabase SQL Editor to set up the database tables.

-- ============================================================================
-- Users
-- ============================================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table users enable row level security;

create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own data"
  on users for update
  using (auth.uid() = id);

-- ============================================================================
-- Goals
-- ============================================================================
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  target_date date,
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table goals enable row level security;

create policy "Users can manage own goals"
  on goals for all
  using (auth.uid() = user_id);

create index idx_goals_user_id on goals(user_id);

-- ============================================================================
-- Tasks
-- ============================================================================
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  goal_id uuid references goals(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can manage own tasks"
  on tasks for all
  using (auth.uid() = user_id);

create index idx_tasks_user_id on tasks(user_id);
create index idx_tasks_goal_id on tasks(goal_id);

-- ============================================================================
-- Journal Entries
-- ============================================================================
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text,
  content text not null,
  mood text check (mood in ('great', 'good', 'okay', 'bad', 'terrible')),
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table journal_entries enable row level security;

create policy "Users can manage own journal entries"
  on journal_entries for all
  using (auth.uid() = user_id);

create index idx_journal_entries_user_id on journal_entries(user_id);
create index idx_journal_entries_created_at on journal_entries(created_at desc);

-- ============================================================================
-- Updated-at trigger
-- ============================================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

create trigger goals_updated_at
  before update on goals
  for each row execute function update_updated_at();

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

create trigger journal_entries_updated_at
  before update on journal_entries
  for each row execute function update_updated_at();
