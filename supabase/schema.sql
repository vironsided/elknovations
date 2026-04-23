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

-- 7. work_categories
create table if not exists work_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- 8. work_cases
create table if not exists work_cases (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid references work_categories(id) on delete set null,
  title            text not null,
  location         text not null default '',
  completed_at     date,
  summary          text not null default '',
  scope_details    text not null default '',
  materials        text not null default '',
  total_price_usd  numeric(12, 2) not null default 0,
  before_image_url text not null default '',
  after_image_url  text not null default '',
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now()
);

-- Add coordinates to work_cases (idempotent)
alter table work_cases add column if not exists latitude  numeric(9, 6);
alter table work_cases add column if not exists longitude numeric(9, 6);

-- 9. google_reviews (ручной ввод отзывов в стиле Google)
create table if not exists google_reviews (
  id             uuid primary key default gen_random_uuid(),
  author_name    text not null,
  author_initial text not null default '',
  rating         int  not null default 5,
  review_text    text not null default '',
  review_date    text not null default '',
  avatar_color   text not null default '',
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now()
);

-- Row Level Security ----------------------------------------------------------

alter table site_settings enable row level security;
alter table services      enable row level security;
alter table projects      enable row level security;
alter table faqs          enable row level security;
alter table testimonials  enable row level security;
alter table social_links  enable row level security;
alter table work_categories enable row level security;
alter table work_cases      enable row level security;
alter table google_reviews  enable row level security;

-- Public read for everyone
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read services"      on services      for select using (true);
create policy "Public read projects"      on projects      for select using (true);
create policy "Public read faqs"          on faqs          for select using (true);
create policy "Public read testimonials"  on testimonials  for select using (true);
create policy "Public read social_links"  on social_links  for select using (true);
create policy "Public read work_categories" on work_categories for select using (true);
create policy "Public read work_cases"      on work_cases      for select using (true);
create policy "Public read google_reviews"  on google_reviews  for select using (true);

-- Authenticated users (admin) can do everything
create policy "Admin write site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Admin write services"      on services      for all using (auth.role() = 'authenticated');
create policy "Admin write projects"      on projects      for all using (auth.role() = 'authenticated');
create policy "Admin write faqs"          on faqs          for all using (auth.role() = 'authenticated');
create policy "Admin write testimonials"  on testimonials  for all using (auth.role() = 'authenticated');
create policy "Admin write social_links"  on social_links  for all using (auth.role() = 'authenticated');
create policy "Admin write work_categories" on work_categories for all using (auth.role() = 'authenticated');
create policy "Admin write work_cases"      on work_cases      for all using (auth.role() = 'authenticated');
create policy "Admin write google_reviews"  on google_reviews  for all using (auth.role() = 'authenticated');

-- Storage bucket for images ---------------------------------------------------
-- Run this AFTER creating a bucket named "images" in Storage (Dashboard → Storage → New bucket → name: images, public: ON)
-- Or use the API: supabase.storage.createBucket('images', { public: true })

insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Admin upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin update images" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Admin delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
