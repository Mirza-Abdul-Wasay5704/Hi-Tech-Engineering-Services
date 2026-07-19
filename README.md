# Hi-Tech Engineering Services — Website

Professional 3D marketing website + content management system for Hi-Tech Engineering Services (elevator maintenance, overhauling, modernization & spare parts — Karachi, Pakistan).

| Piece | Tech | Where it runs |
|---|---|---|
| Public website + admin panel | Next.js 16 (App Router, Tailwind 4, Three.js/R3F, Framer Motion) | **Vercel** (free) |
| API + auth + revalidation | FastAPI (Python) | **Render** (free) |
| Database + image storage | Postgres + Storage | **Supabase** (free) |
| Lead notification emails | Resend API | **Resend** (free, 100/day) |

**Design:** "Industrial Precision" — dark engineering theme, amber/blue accents, wireframe 3D elevator-shaft hero, scroll-linked elevator floor indicator, blueprint grid motifs.

---

## 1. Run locally

**Backend** (Python 3.11+):
```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt        # Windows
.venv/Scripts/python -m uvicorn app.main:app --port 8001
```
First start creates `hitech.db` (SQLite), seeds all content from the portfolio PDF, and creates the admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars, defaults in `.env.example`).

Optional — fetch client logos from Wikipedia: `.venv/Scripts/python scripts/fetch_logos.py`

**Frontend** (Node 20+):
```bash
cd frontend
npm install
cp .env.example .env.local   # defaults already point at :8001
npm run dev                  # http://localhost:3000
```

---

## 2. Updating the website (no code needed)

Go to **`/admin`** and log in. From there you can:

- **Projects** — add/edit/delete projects, upload client logos & building photos, mark projects *featured* (homepage) or include them in the logo wall. 
- **Blog** — write articles in Markdown with live preview, SEO title/description, cover image, publish/draft.
- **Leads** — every contact-form submission lands here (and in your email if Resend is configured); track new → contacted → closed.
- **Settings** — phones, email, address, working hours, hero headline, homepage stats.

Every save automatically refreshes the live site within seconds (on-demand ISR revalidation). **You should never need to touch code to update content.** Code changes are only for design/layout changes.

> ⚠️ Change the admin password before going live (set `ADMIN_PASSWORD` before first boot, or update the row in the DB).

---

## 3. Deploy (all free tiers)

### 3.1 Push to your (existing, empty) GitHub repo
This folder is already a git repo. Point it at your empty GitHub repo and push:
```bash
git add -A
git commit -m "Hi-Tech Engineering website"
git branch -M main
git remote add origin https://github.com/<you>/<your-repo>.git   # your empty repo's URL
git push -u origin main
```
If the remote already had a commit (e.g. an auto-created README), run
`git pull --rebase origin main` before pushing, or `git push -u origin main --force`
if you're sure the remote is throwaway.

> Client logos and building photos live in `backend/seed_assets/` (committed) and are
> uploaded to storage + attached to projects automatically on first server boot, so a
> fresh deploy reproduces every image. Runtime uploads in `backend/uploads/` and secrets
> in `.env` are gitignored and never pushed.

### 3.2 Supabase — database + image storage (no credit card)
1. Create a free project at [supabase.com](https://supabase.com) (region: Mumbai/Singapore is closest to PK). You'll set a **database password** here — save it.
2. **Storage → New bucket** → name it `media` → toggle **Public** → Create.
3. Collect these four values (used as env vars on Render in step 3.3) — **where to find each:**
   | Env var | Where in Supabase | Looks like |
   |---|---|---|
   | `DATABASE_URL` | **Project Settings → Database → Connection string → URI tab → "Session pooler"**. Replace `[YOUR-PASSWORD]` with your DB password. | `postgresql://postgres.abcd:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` |
   | `SUPABASE_URL` | **Project Settings → API → Project URL** | `https://abcdefgh.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | **Project Settings → API → Project API keys → `service_role`** (click *Reveal*). Secret — server only. | `eyJhbGciOi…` (long) |
   | `SUPABASE_BUCKET` | the bucket you made in step 2 | `media` |

   > Use the **Session pooler** connection string (port 5432), not the "Direct connection" one — the pooler works reliably from hosts like Render.

### 3.3 Render — FastAPI backend (free, **no credit card**)
> The card wall you saw comes from the **Blueprint** flow. A plain free **Web Service** does **not** require a card — so use the manual path below and skip Blueprint entirely (the `render.yaml` in the repo is simply ignored).
1. [render.com](https://render.com) → sign up with GitHub (no card asked).
2. **New → Web Service** → connect your GitHub repo → configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** **Free**
3. **Environment → Add Environment Variable** — paste each (the 4 Supabase values from 3.2, plus):
   - `JWT_SECRET` (long random string), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (your admin login), `REVALIDATE_SECRET` (long random — must match Vercel), `CORS_ORIGINS` + `FRONTEND_URL` (your Vercel URL, e.g. `https://your-site.vercel.app`), `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`.
   - These live **only** here in Render — never in the repo.
4. **Create Web Service.** First boot seeds Postgres and uploads `backend/seed_assets/` (all logos + building photos) to your Supabase `media` bucket automatically. Note your API URL, e.g. `https://hitech-api.onrender.com`.
5. **Keep-warm (optional):** a free [UptimeRobot](https://uptimerobot.com) monitor pinging `…/health` every 5 min avoids the ~30s cold start on the admin panel / contact form (public pages are static and unaffected).

> **If Render *still* asks for a card** (rare, region-triggered): tell me and I'll add a `Dockerfile` so you can deploy the same backend to a **Hugging Face Space** (you already have an account) or **Koyeb** — both are guaranteed no-card.

### 3.4 Vercel (Next.js)
1. [vercel.com](https://vercel.com) → **Add New Project** → import the repo → set **Root Directory = `frontend`**.
2. Env vars: `NEXT_PUBLIC_API_URL=https://hitech-api.onrender.com`, `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`, `REVALIDATE_SECRET=<same as Render>`.
3. Deploy. Every future `git push` redeploys both platforms automatically.

### 3.5 Resend (lead emails, optional but recommended)
Create a free account at [resend.com](https://resend.com), verify your domain (or use their test sender initially), and set `RESEND_API_KEY` + `LEAD_FROM_EMAIL` on Render.

---

## 4. The .com domain (~$10–12/yr — domains are never free)

1. **Buy** e.g. `hitechengineeringservices.com` at Cloudflare Registrar (at-cost, cheapest renewals), Namecheap or Porkbun.
2. **Frontend:** Vercel → Project → Settings → **Domains** → add `yourdomain.com` and `www.yourdomain.com`. Add the DNS records Vercel shows you at your registrar:
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
   HTTPS certificates are automatic.
3. **API:** at your registrar add `CNAME api → hitech-api.onrender.com`, then in Render → Settings → **Custom Domains** add `api.yourdomain.com` (free auto-SSL).
4. Update env vars to the new domain: Vercel `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`, `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`; Render `CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`, `FRONTEND_URL=https://yourdomain.com`. Redeploy.

---

## 5. SEO & AI-search launch checklist (do these once — highest impact first)

Built into the site already: unique metadata per page, `LocalBusiness`/`Service`/`FAQPage`/`Article`/`BreadcrumbList` JSON-LD, dynamic `sitemap.xml`, `robots.txt` welcoming AI crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot…), **`llms.txt`** company summary for LLMs, answer-shaped intro paragraphs on every service page, fast static pages (ISR), OG images.

What only you can do:

1. **Google Business Profile** ([business.google.com](https://business.google.com)) — *the #1 lever for "elevator maintenance karachi"*. Create the listing with EXACTLY the same name/address/phone as the website footer, category **"Elevator service"**, add photos, and ask happy clients (you have 25!) for Google reviews. A few reviews mentioning "elevator maintenance" beats months of other SEO.
2. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)) — verify the domain, submit `https://yourdomain.com/sitemap.xml`.
3. **Bing Webmaster Tools** — same thing; Bing's index feeds ChatGPT search and Copilot, so this directly affects LLM recommendations.
4. **Citations** — list the business (same NAP) on Pakistani directories and Facebook Business. Consistency across the web is how Google & LLM knowledge graphs "confirm" a business exists.
5. **Testimonials/backlinks** — ask 3–5 clients for a testimonial (add via admin later) and, where possible, a link from their site.

### Content strategy (the ongoing part — 1–2 posts/month via /admin → Blog)
People ask Google and ChatGPT questions; whoever's indexed answer is best becomes the recommendation. Starter topics:
1. Elevator AMC guide for building managers in Pakistan (costs, what's included)
2. Geared vs gearless elevator motors — what your building has and why it matters
3. Sigma/LG elevator troubleshooting basics (your specialty keyword)
4. How often should elevators be serviced in Pakistan?
5. Elevator safety checklist for high-rise residential buildings in Karachi
6. VVVF inverter upgrades: cutting elevator energy bills 30–40%
7. Why elevator floor leveling drifts — and how it's fixed
8. What to do when your elevator brand's spare parts are discontinued
9. Hospital elevator maintenance: what makes it different
10. Case study: modernizing a 20-year-old elevator (before/after)

### Client logos note
The logo wall displays clients' logos (Avari, PSX, PARCO, Faysal Bank, LNH fetched; others show styled name cards — replace anytime via /admin → Projects). Displaying client logos is standard B2B practice, but it's best practice to get a one-line written OK from each client — it also protects the relationship.

---

## 6. Project structure

```
├── frontend/                 Next.js 16
│   ├── app/(site)/           public pages (home, services, projects, about, contact, blog)
│   ├── app/admin/            content management panel
│   ├── app/api/revalidate/   on-demand ISR hook (called by backend on save)
│   ├── app/{sitemap,robots,manifest}.ts, app/llms.txt/, app/opengraph-image.tsx
│   ├── components/           UI, motion primitives, 3D scenes (components/three)
│   └── lib/                  API client, SEO/JSON-LD helpers, types
├── backend/                  FastAPI
│   ├── app/models.py         Project / Service / BlogPost / Lead / Testimonial / Settings / AdminUser
│   ├── app/routers/          REST endpoints (public read, JWT-protected admin CRUD)
│   ├── app/seed.py           initial content from the portfolio PDF
│   └── scripts/fetch_logos.py  Wikipedia logo fetcher
└── render.yaml               Render deploy blueprint
```
