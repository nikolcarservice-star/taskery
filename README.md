# Taskery

Фриланс-биржа для заказчиков и исполнителей: проекты, отклики, эскроу-сделки, чат, отзывы и TaskBoost для продвижения профиля.

## Stack

- **Next.js 16** (App Router)
- **NextAuth v5** — email/password + Google OAuth
- **Prisma 7** + PostgreSQL
- **Stripe** — пополнение баланса, TaskBoost, разовое продвижение
- **Tailwind CSS 4**

## Quick start

### 1. PostgreSQL

```bash
docker compose up -d
```

### 2. Environment

```bash
cp .env.example .env
```

Set at minimum `DATABASE_URL` and `AUTH_SECRET`.

### 3. Database

```bash
npm install
npm run db:push
npm run db:seed
```

### 4. Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Public tunnel (phone on mobile data)

Expose the local dev server to the internet (no same Wi‑Fi required):

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run tunnel
```

Cloudflare prints a URL like `https://xxxx.trycloudflare.com` — open it on any device.

Copy the hostname into `.env` (then restart `npm run dev`):

```env
TUNNEL_HOST="xxxx.trycloudflare.com"
NEXT_PUBLIC_SITE_URL="https://xxxx.trycloudflare.com"
```

Do **not** set `AUTH_URL` to `localhost` while using a tunnel. The tunnel URL changes each time you run `npm run tunnel`.

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@taskery.local` | `admin123` |
| Client | `client@taskery.local` | `demo12345` |
| Freelancer | `freelancer@taskery.local` | `demo12345` |

Admin login: [/admin](http://localhost:3000/admin)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run tunnel` | Public HTTPS URL to localhost:3000 (Cloudflare) |
| `npm run build` | Production build |
| `npm run db:push` | Sync schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio |

## Business model

- **Заказчики** — бесплатно, комиссия **10%** удерживается из суммы сделки при завершении
- **Фрилансеры** — TaskBoost подписка для продвижения профиля
- **Эскроу** — заказчик резервирует сумму с баланса, выплата после принятия работы

## Stripe setup

1. Create products/prices in Stripe Dashboard (UAH)
2. Set `STRIPE_SECRET_KEY` and webhook endpoint → `/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
4. Set `STRIPE_WEBHOOK_SECRET`

Without Stripe in **development**, clients can use demo top-up (+50 000 ₴). Demo top-up is **disabled in production**.

## Project structure

```
src/app/          — pages and API routes
src/components/   — UI components
src/lib/          — server actions, auth, queries
prisma/           — schema and seed
```

## Production checklist

- [ ] Set `AUTH_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`
- [ ] Configure Stripe + webhook
- [ ] Configure Resend for transactional email
- [ ] Add Vercel Blob store for avatar & portfolio uploads (`BLOB_READ_WRITE_TOKEN`)
- [ ] Run `npm run build` before deploy

## Deploy to Vercel

### 1. Database

Use a managed PostgreSQL provider with **connection pooling** (recommended):

- [Neon](https://neon.tech) — enable pooled connection string
- [Supabase](https://supabase.com) — use the pooler URL (port 6543)
- [Vercel Postgres](https://vercel.com/storage/postgres) — use `POSTGRES_URL` as `DATABASE_URL`

Apply the schema once against the production database (from your machine):

```bash
DATABASE_URL="postgresql://..." npm run db:push
# optional demo data (staging only):
DATABASE_URL="postgresql://..." npm run db:seed
```

### 2. Import project

1. Push the repo to GitHub/GitLab/Bitbucket
2. [Import into Vercel](https://vercel.com/new) — framework is auto-detected as Next.js
3. Set **Root Directory** to the repo root (default)

Vercel runs `npm install` (which triggers `postinstall` → `prisma generate`) and `npm run build`.

### 3. Environment variables

In **Project → Settings → Environment Variables**, add at minimum:

| Variable | Environments | Notes |
|----------|--------------|-------|
| `DATABASE_URL` | Production, Preview | Pooled connection string |
| `AUTH_SECRET` | Production, Preview | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://your-domain.vercel.app` or custom domain |
| `BLOB_READ_WRITE_TOKEN` | Production, Preview | Auto-set when you create a Blob store (see below) |

Copy optional vars from [`.env.example`](.env.example) (Stripe, Google OAuth, Resend).

### 3.1 File uploads (Vercel Blob)

Avatars and portfolio images use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) in production.

1. Vercel → your project → **Storage** → **Create Database / Store** → **Blob**
2. Connect the store to the project — Vercel adds `BLOB_READ_WRITE_TOKEN` automatically
3. **Redeploy** after creating the store

Without Blob, uploads still work locally (`public/uploads/`). On Vercel without the token, avatar file upload fails; portfolio can still use image URLs.

> **Do not** set `TUNNEL_HOST` on Vercel — it is for local dev tunnels only.

NextAuth uses `trustHost: true`, so `AUTH_URL` is not required on Vercel.

### 4. Custom domain

Add your domain in Vercel → **Domains**, then update `NEXT_PUBLIC_SITE_URL` to match.

### 5. Stripe webhook (production)

Create a webhook endpoint in Stripe Dashboard:

- URL: `https://your-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
- Set `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 6. Google OAuth (optional)

In Google Cloud Console, add authorized redirect URI:

```
https://your-domain.com/api/auth/callback/google
```

### 7. Post-deploy checks

- [ ] Home page loads
- [ ] Login / register works
- [ ] Admin panel at `/admin`
- [ ] Stripe checkout (if configured)
- [ ] Avatar & portfolio file upload (requires Blob store on Vercel)

### CLI deploy (alternative)

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # sync env vars locally
vercel --prod
```
