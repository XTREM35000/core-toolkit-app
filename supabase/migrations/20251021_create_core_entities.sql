-- Migration: create core entities for AquaManager
-- Creates tables: bassins, parcs, poissons, escargots, stock, activities

create table if not exists bassins (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists parcs (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists poissons (
  id uuid primary key default gen_random_uuid(),
  species text,
  quantity integer default 0,
  bassin_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists escargots (
  id uuid primary key default gen_random_uuid(),
  batch_name text,
  quantity integer default 0,
  parc_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists stock (
  id uuid primary key default gen_random_uuid(),
  item_name text,
  quantity integer default 0,
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists activities (
  id bigserial primary key,
  action text not null,
  created_by uuid,
  user_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists activities_created_at_idx on activities (created_at desc);
