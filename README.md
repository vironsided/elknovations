# Elk Novations — marketing site + admin panel

React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion.  
Admin panel backed by **Supabase** (free tier) for managing all site content.

## Quick start

```bash
npm install
npm run dev        # main site at http://localhost:5173
```

## Environment variables

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_WEB3FORMS_ACCESS_KEY=your_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `VITE_WEB3FORMS_ACCESS_KEY` | [web3forms.com](https://web3forms.com) | Yes (contact form) |
| `VITE_SUPABASE_URL` | Supabase project → Settings → API | For admin panel |
| `VITE_SUPABASE_ANON_KEY` | Supabase project → Settings → API | For admin panel |

Without Supabase env vars the main site works fine using hardcoded fallback data from `src/data/site.ts`. The admin panel requires Supabase to be connected.

---

## Admin panel

### 1. Create a Supabase project (free, no credit card)

1. Go to [supabase.com](https://supabase.com) and sign in with GitHub.
2. Click **New project** → pick a name and region → create.
3. Go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public** key → `VITE_SUPABASE_ANON_KEY`
4. Add both to your `.env` (local) and Vercel environment variables (production).

### 2. Run the database schema

1. In Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. This creates tables: `site_settings`, `services`, `projects`, `faqs`, `testimonials`, `social_links`, `work_categories`, `work_cases` (with optional `latitude`/`longitude`), `google_reviews`, plus RLS policies and a public `images` storage bucket.

### 3. Create the admin user

1. In Supabase dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the admin email and password.
3. That's the only account — no registration on the site.

### 4. Access the admin panel

- **Local:** `http://localhost:5173/admin/login`
- **Production:** `https://elknovations.com/admin/login`

Log in with the email/password from step 3. The dashboard lets you manage:

- **Projects** — add/edit/delete showcase projects with images
- **Work Categories** — create/edit/remove categories for the full `/work` page
- **Work Cases** — manage before/after projects with location, date, scope, materials, and price
- **Services** — manage service offerings with icon picker
- **FAQs** — add/edit/delete questions and answers
- **Testimonials** — manage client reviews
- **Google Reviews** — manage Google-style reviews shown in the "See work near you" drawer
- **Social Links** — choose social platforms and links for "Follow us"
- **Site Settings** — edit brand name, tagline, hero section, about text, contact info, stats

### 5. Full work catalog page (`/work`)

- Main homepage keeps the existing `Our work` showcase.
- "View all projects" button opens `/work`.
- `/work` includes:
  - category filters from `work_categories`,
  - before/after cards from `work_cases`,
  - detailed scope, materials, location, completion date, and average price.

Recommended setup order in admin panel:
1. Create categories in **Work Categories**.
2. Add portfolio items in **Work Cases** and assign category.

### 6. "See work near you" drawer

A floating "See work near you" tab on the left of the homepage opens a fullscreen magazine-style drawer with three blocks:

- **Featured reviews** — horizontal slider of Google-style review cards (stars, text, author, date, colored avatar initial).
- **Featured projects** — horizontal slider of `work_cases` (newest first by `completed_at`).
- **Map** — interactive [Leaflet](https://leafletjs.com) map with [OpenStreetMap](https://www.openstreetmap.org) tiles. No API keys, no billing.

#### Re-run the SQL (only the new parts)

If you set up Supabase before this feature shipped, run this snippet once in **SQL Editor** — it is idempotent:

```sql
alter table work_cases add column if not exists latitude  numeric(9, 6);
alter table work_cases add column if not exists longitude numeric(9, 6);

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

alter table google_reviews enable row level security;
create policy "Public read google_reviews" on google_reviews for select using (true);
create policy "Admin write google_reviews" on google_reviews for all using (auth.role() = 'authenticated');
```

Or just re-run the full [`supabase/schema.sql`](supabase/schema.sql) — every statement is `if not exists` / `add column if not exists`.

#### Add Google-style reviews (manual entry)

1. Open `/admin/google-reviews` → **Add review**.
2. Fill in author name, rating, review text, and a human-friendly date ("2 months ago" or "March 2026").
3. Optionally set a custom avatar color (`#1a73e8` etc.) — otherwise it auto-colors from the name.
4. Save — the review appears immediately in the drawer.

You can later swap to the Google Places API without touching the UI: replace `useGoogleReviews()` in `src/hooks/useSiteData.ts` with a call that fetches reviews from Google and maps them to the same shape.

#### Add coordinates for map pins (3 steps)

1. Open [Google Maps](https://www.google.com/maps), search for the project address.
2. Right-click the exact spot → click the decimal coordinates at the top of the menu (e.g. `40.712776, -74.005974`) to copy them.
3. In `/admin/work-cases`, open the case, paste the first number into **Latitude** and the second into **Longitude**, then save. The pin appears on the drawer map immediately.

Work cases without coordinates are still shown in the slider and on `/work`; they just don't appear as map pins.

---

## Contact form with attachments (free via Resend)

If Web3Forms asks for a Pro plan when files are attached, switch to Supabase Edge Function + Resend.

1. Create a function:
   - `supabase/functions/send-contact/index.ts` is included in this repo.
2. Set function secrets:
   - `RESEND_API_KEY=...`
   - `CONTACT_TO_EMAIL=you@example.com`
   - `CONTACT_FROM_EMAIL=onboarding@resend.dev` (or your verified domain sender)
3. Deploy the function:
   - `supabase functions deploy send-contact --no-verify-jwt`
4. Add frontend env:
   - `VITE_CONTACT_ENDPOINT=https://<project-ref>.supabase.co/functions/v1/send-contact`
5. Redeploy frontend.

Notes:
- Never put `RESEND_API_KEY` in frontend code or `VITE_*` variables.
- The form still supports Web3Forms fallback when `VITE_CONTACT_ENDPOINT` is empty.

---

## Contact form (Web3Forms)

The contact form POSTs to [Web3Forms](https://web3forms.com) (free tier, text only).

1. Open [web3forms.com](https://web3forms.com), enter the inbox email, and copy the **Access Key**.
2. Set `VITE_WEB3FORMS_ACCESS_KEY` in `.env` locally and in Vercel environment variables for production.

---

## Deploy to elknovations.com

The site is hosted on **Vercel** (free). The domain is on **GoDaddy**.

### Connect GoDaddy domain to Vercel

1. In **Vercel** → project → **Settings** → **Domains** → add `elknovations.com`.
2. Vercel will show DNS records to add. In **GoDaddy** → DNS Management:
   - Add **A record**: `@` → `76.76.21.21`
   - Add **CNAME**: `www` → `cname.vercel-dns.com`
3. Save. SSL is auto-provisioned by Vercel (can take a few minutes).

### Vercel environment variables

Add all three `VITE_*` variables in Vercel → Settings → Environment Variables for **Production** (or All Environments), then **Redeploy**.

---

## Tech stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** + Framer Motion
- **Lucide React** for icons
- **Supabase** (PostgreSQL + Auth + Storage) — free tier
- **Web3Forms** for contact form
- **Leaflet + OpenStreetMap** for the "See work near you" map (free, no API keys)
- **React Router** for `/` (main site), `/work` (full portfolio), and `/admin/*` (admin panel)
