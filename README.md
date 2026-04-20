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
3. This creates tables: `site_settings`, `services`, `projects`, `faqs`, `testimonials`, `social_links`, `work_categories`, `work_cases`, plus RLS policies and a public `images` storage bucket.

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
- **React Router** for `/` (main site), `/work` (full portfolio), and `/admin/*` (admin panel)
