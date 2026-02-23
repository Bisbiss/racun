-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
-- Stores user information, bio, and custom appearance settings.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  instagram_url text,
  tiktok_url text,
  whatsapp_url text,
  theme_color text default '#10b981', -- Using our emerald green default
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on row level security for profiles
alter table public.profiles enable row level security;

-- Profile Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Links Table
-- Stores the affiliate links created by the user.
create table public.links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  order_index integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on row level security for links
alter table public.links enable row level security;

-- Link Policies
create policy "Links are viewable by everyone." on public.links
  for select using (true);

create policy "Users can insert their own links." on public.links
  for insert with check (auth.uid() = user_id);

create policy "Users can update own links." on public.links
  for update using (auth.uid() = user_id);

create policy "Users can delete own links." on public.links
  for delete using (auth.uid() = user_id);

-- 3. Link Clicks (Analytics) Table
-- Records every time a visitor clicks an affiliate link.
create table public.link_clicks (
  id uuid default uuid_generate_v4() primary key,
  link_id uuid references public.links(id) on delete cascade not null,
  visitor_ip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics Policies
alter table public.link_clicks enable row level security;

-- Anyone can insert a click (when viewing the public profile)
create policy "Anyone can insert link clicks." on public.link_clicks
  for insert with check (true);

-- Only link owners can view their clicks
create policy "Users can view clicks of their own links." on public.link_clicks
  for select using (
    exists (
      select 1 from public.links 
      where links.id = link_clicks.link_id 
      and links.user_id = auth.uid()
    )
  );

-- Automatically create profile trigger on auth.user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id, 
    LOWER(SPLIT_PART(new.email, '@', 1)), -- Default username from email
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
