-- Elk Novations — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query → paste → Run)

-- 1. site_settings: key-value store for brand, hero, about, contact, stats
create table if not exists site_settings (
  key  text primary key,
  value jsonb not null default '{}'::jsonb
);

-- 2. services
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  image_url   text not null default '',
  icon        text not null default 'Hammer',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- 3. projects
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null default '',
  duration    text not null default '',
  description text not null default '',
  quote       text not null default '',
  author      text not null default '',
  image_url   text not null default '',
  theme       text not null default 'light',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- 4. faqs
create table if not exists faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- 5. testimonials
create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  text       text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- 6. social_links
create table if not exists social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  url        text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- Row Level Security ----------------------------------------------------------

alter table site_settings enable row level security;
alter table services      enable row level security;
alter table projects      enable row level security;
alter table faqs          enable row level security;
alter table testimonials  enable row level security;
alter table social_links  enable row level security;

-- Public read for everyone
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read services"      on services      for select using (true);
create policy "Public read projects"      on projects      for select using (true);
create policy "Public read faqs"          on faqs          for select using (true);
create policy "Public read testimonials"  on testimonials  for select using (true);
create policy "Public read social_links"  on social_links  for select using (true);

-- Authenticated users (admin) can do everything
create policy "Admin write site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Admin write services"      on services      for all using (auth.role() = 'authenticated');
create policy "Admin write projects"      on projects      for all using (auth.role() = 'authenticated');
create policy "Admin write faqs"          on faqs          for all using (auth.role() = 'authenticated');
create policy "Admin write testimonials"  on testimonials  for all using (auth.role() = 'authenticated');
create policy "Admin write social_links"  on social_links  for all using (auth.role() = 'authenticated');

-- Storage bucket for images ---------------------------------------------------
-- Run this AFTER creating a bucket named "images" in Storage (Dashboard → Storage → New bucket → name: images, public: ON)
-- Or use the API: supabase.storage.createBucket('images', { public: true })

insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Admin upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin update images" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
