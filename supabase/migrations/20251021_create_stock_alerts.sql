-- Migration: create stock_aliments and alerts tables

create table if not exists stock_aliments (
  id uuid primary key default gen_random_uuid(),
  item_name text,
  quantity integer default 0,
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists alertes (
  id bigserial primary key,
  title text,
  level text,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists alerts (
  id bigserial primary key,
  title text,
  level text,
  payload jsonb,
  created_at timestamptz default now()
);
