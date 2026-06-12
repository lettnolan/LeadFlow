-- Run this in your Supabase SQL Editor

create table if not exists saved_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id text not null,
  name text,
  address text,
  phone text,
  website text,
  website_status text,
  opportunity_score text,
  rating numeric,
  review_count int,
  created_at timestamptz not null default now(),
  unique(user_id, lead_id)
);

alter table saved_leads enable row level security;

create policy "Users can manage their own saved leads"
  on saved_leads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
