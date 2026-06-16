# Muna's Kitchen 🎂

A beautiful, responsive bakery & dessert website with a PHP reservation API backed by Supabase — deployed on Vercel.

## Project Structure

```
munas-kitchen/
├── public/
│   ├── index.html          ← Main website
│   ├── css/
│   │   └── style.css       ← All styles
│   └── js/
│       ├── menu.js         ← Menu data & filter logic
│       └── app.js          ← Nav, scroll, reservation form
├── api/
│   └── reserve.php         ← Serverless PHP API (Vercel)
├── vercel.json             ← Vercel routing & PHP runtime config
├── supabase-schema.sql     ← Run once in Supabase SQL Editor
├── .env.example            ← Environment variables template
└── README.md
```

---

## 🚀 Deployment Guide

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `munas-kitchen`, choose your region, set a password
3. Once created, go to **SQL Editor → New Query**
4. Paste the contents of `supabase-schema.sql` and click **Run**
5. Go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcdef.supabase.co`)
   - **Service Role Key** (under "Project API keys")

---

### Step 2 — Deploy to Vercel

#### Option A — Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# In the project root
cd munas-kitchen
vercel

# Follow prompts:
# - Link to existing project? No → create new
# - Project name: munas-kitchen
# - Root directory: ./ (press Enter)
```

#### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Set **Output Directory** to `public`
5. Click **Deploy**

---

### Step 3 — Add Environment Variables in Vercel

1. In Vercel Dashboard → your project → **Settings → Environment Variables**
2. Add:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...your service role key...` |

3. Click **Save** → **Redeploy** from the Deployments tab

---

### Step 4 — Verify it works

1. Visit your Vercel URL (e.g. `https://munas-kitchen.vercel.app`)
2. Fill in the reservation form and submit
3. Check **Supabase Dashboard → Table Editor → reservations** — your booking should appear!

---

## 🛠 Local Development

```bash
# Serve the frontend only (no PHP)
cd public
npx serve .

# Or use PHP's built-in server (PHP 8+ required)
cd munas-kitchen
php -S localhost:8000 -t public
```

For full local API testing, set environment variables in your shell:

```bash
export SUPABASE_URL=https://xxx.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJ...
php -S localhost:8000 -t public
```

---

## 📋 Supabase Table: `reservations`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated |
| name | TEXT | Guest name |
| email | TEXT | Guest email |
| phone | TEXT | Optional |
| guests | TEXT | e.g. "4 guests" |
| date | DATE | Reservation date |
| time | TEXT | e.g. "2:00 PM" |
| notes | TEXT | Special requests |
| status | TEXT | pending / confirmed / cancelled |
| created_at | TIMESTAMPTZ | Auto-set |

---

## 🎨 Tech Stack

- **Frontend**: HTML5, CSS3 (custom properties, grid, flexbox), Vanilla JS
- **Backend**: PHP 8 (Vercel serverless via `vercel-php` runtime)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Fonts**: Cormorant Garamond + DM Sans (Google Fonts)
