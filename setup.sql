-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create profiles table
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'reader' check (role in ('admin', 'editor', 'reader')),
  created_at timestamptz default now()
);

-- 2. Create categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  color text,
  icon text,
  created_at timestamptz default now()
);

-- 3. Create posts table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  author_id uuid references profiles(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_premium boolean default false,
  view_count integer default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Create comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create a trigger to update 'updated_at' on posts and comments
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_posts_updated_at
    before update on posts
    for each row
    execute function update_updated_at_column();

create trigger update_comments_updated_at
    before update on comments
    for each row
    execute function update_updated_at_column();
