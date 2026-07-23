# Koplus SAM — Payload Backend

Headless CMS + REST/GraphQL API for the [SAM Booth Configurator](https://koplus-sam.vercel.app).

Built with **Next.js 15 + Payload CMS 3** on top of **SQLite (local dev)** / **Postgres (production)**.

---

## Local development

### Prerequisites
- Node 20+
- npm

### Setup

```bash
cp .env.example .env
# Add your Clerk API keys to .env (SQLite defaults already work locally)
npm install
npm run dev
```

Open <http://localhost:3000/admin>. Clerk redirects signed-out visitors to
<http://localhost:3000/sign-in>. In local development, the first Clerk account
that signs in is linked as the initial Payload admin.

For production, set `CLERK_ADMIN_EMAILS` to a comma-separated allowlist before
the first sign-in. Existing Payload users are linked automatically when their
email matches the Clerk account.

### Seed data

Imports the current SAM catalogue (3 booths, 5 palettes, 41 colors, 4 accessories):

```bash
npx tsx src/seed.ts
```

Idempotent — running it again skips existing records.

---

## Project structure

```
src/
├── collections/         # Payload collection definitions
│   ├── Users.ts
│   ├── Media.ts
│   ├── Palettes.ts
│   ├── Colors.ts
│   ├── Accessories.ts
│   └── Products.ts
├── payload.config.ts    # Main Payload config (DB adapter, collections, CORS)
├── seed.ts              # One-shot script to import existing data
└── app/                 # Next.js App Router (admin UI + API routes auto-generated)
```

---

## Deployment to Vercel + Neon

### 1. Create a Neon Postgres database

1. Sign up at <https://neon.tech>
2. Create a new project (free tier)
3. Copy the connection string (looks like `postgres://USER:PASSWORD@HOST/DBNAME?sslmode=require`)

### 2. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:YOUR_ORG/sam-payload.git
git push -u origin main
```

### 3. Connect to Vercel

1. Import the GitHub repo at <https://vercel.com/new>
2. Framework preset: **Next.js** (auto-detected)
3. Set environment variables:
   - `DATABASE_URI` — the Neon connection string
   - `PAYLOAD_SECRET` — generate with `openssl rand -hex 32`
4. Deploy

The Postgres adapter is automatically used when `DATABASE_URI` starts with `postgres://`.

### 4. Seed production data (one time)

```bash
# Locally, pointing at production DB:
DATABASE_URI="postgres://..." PAYLOAD_SECRET="..." npx tsx src/seed.ts
```

### 5. Wire the configurator

In the `sam/` repo's `index.html`, update the API base URL:

```js
SamApp({
  el: "#sam-app",
  apiBase: "https://YOUR-DEPLOYMENT.vercel.app"
});
```

Push and Vercel will auto-deploy.

---

## CORS

`payload.config.ts` currently allows `cors: '*'` for development. **Before going to production**, restrict it to your configurator's domain:

```ts
cors: ['https://koplus-sam.vercel.app', 'http://localhost:8000'],
```

---

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/products?depth=2&limit=100` | List of booth products with nested palettes & accessories |
| `GET /api/colors?depth=1&limit=200` | All color swatches grouped by palette |
| `GET /api/palettes` | List of palettes |
| `GET /api/accessories?depth=1` | List of accessories |
| `POST /api/graphql` | GraphQL endpoint (full schema) |
| `GET /api/graphql-playground` | GraphQL playground UI |

---

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URI` | ✅ | SQLite (`file:./payload.db`) or Postgres (`postgres://...`) |
| `PAYLOAD_SECRET` | ✅ | Long random string. Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk server-side secret; never expose to client code |
| `CLERK_ADMIN_EMAILS` | production | Comma-separated emails allowed to bootstrap/link admin users |
| `NEXT_PUBLIC_SERVER_URL` | optional | Public URL of this deployment (Vercel sets automatically) |
# koplus-sam-payload
