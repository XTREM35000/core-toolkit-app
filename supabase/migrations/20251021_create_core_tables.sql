-- Migration: create core tables for AquaHelix

create table if not exists activities (
  id bigserial primary key,
  action text not null,
  created_by uuid,
  user_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
create index if not exists activities_created_at_idx on activities (created_at desc);

create table if not exists alerts (
  id bigserial primary key,
  title text,
  level text,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists stock_items (
  id uuid primary key default gen_random_uuid(),
  item_name text,
  quantity integer default 0,
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fishes (
  id uuid primary key default gen_random_uuid(),
  species text,
  quantity integer default 0,
  created_at timestamptz default now()
);

create table if not exists snails (
  id uuid primary key default gen_random_uuid(),
  batch_name text,
  quantity integer default 0,
  created_at timestamptz default now()
);

create table if not exists ponds (
  id uuid primary key default gen_random_uuid(),
  name text,
  farm_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists parks (
  id uuid primary key default gen_random_uuid(),
  name text,
  type text,
  farm_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists distributions (
  id bigserial primary key,
  stock_item_id uuid,
  quantity integer,
  distributed_at timestamptz default now(),
  distributed_by uuid
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  role text,
  created_at timestamptz default now()
);

create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  name text,
  tenant_id uuid,
  created_at timestamptz default now()
);

-- keep existing french-compatible tables if present
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
