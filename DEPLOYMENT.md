# HUEXE — Cloudflare Production Deployment Guide
### Next.js 16 · React 19 · PostgreSQL · Cloudflare Pages & Workers · Hyperdrive · Code Mode MCP

---

## 1. Architecture Overview

**HUEXE** is an editorial-grade high-fashion mother agency platform and turnkey remote production studio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **GSAP 3**, and **PostgreSQL (Drizzle ORM)**.

Deploying Next.js 16 + PostgreSQL to Cloudflare's global edge network unites static asset delivery from 330+ edge locations with dynamic server-rendered pages and secure database transactions at the edge.

```
                           [ Cloudflare Global Anycast Edge ]
                                          |
               +--------------------------+--------------------------+
               |                                                     |
    [ Static & Media Assets ]                                 [ Next.js 16 App ]
    - /_next/static (Immutable)                               - React Server Components
    - Raw WebGL Shaders & Canvas                              - Server Actions (12MB)
    - public/_headers (CSP, HSTS)                             - Node.js Compat Runtime
    - public/_redirects                                       - /admin & /talent/[slug]
               |                                                     |
               +--------------------------+--------------------------+
                                          |
                         [ Cloudflare Hyperdrive ]
                   (Global Connection Pooling & Query Caching)
                                          |
               +--------------------------+--------------------------+
               |                          |                          |
       [ Neon Serverless ]       [ Supabase Postgres ]     [ Self-Hosted PG ]
```

---

## 2. Next.js 16 Edge & Runtime Compatibility

### 2.1 Compatibility Mode (`nodejs_compat`)
Next.js 16 App Router uses Node.js standard APIs (`crypto`, `buffer`, `stream`, `async_hooks`, `net`) for Server Actions, session authentication (`scryptSync`, `timingSafeEqual`), and database connections.

To run Next.js 16 on Cloudflare Workers/Pages, the `nodejs_compat` compatibility flag is **mandatory** in `wrangler.toml`:
```toml
compatibility_date = "2025-02-15"
compatibility_flags = ["nodejs_compat"]
```

### 2.2 Dual Cloudflare Deployment Options
Cloudflare provides two modern deployment strategies for Next.js:

| Feature | OpenNext for Cloudflare (`@opennextjs/cloudflare`) | Cloudflare Pages (`@cloudflare/next-on-pages`) |
|---|---|---|
| **Target** | Cloudflare Workers + Static Assets | Cloudflare Pages Functions |
| **Next.js Support** | Next.js 14, 15, and 16 | Next.js 13 and 14 (Edge runtime only) |
| **Node.js Runtime** | Full Node.js built-ins via `nodejs_compat` | Restricted to V8 Edge subset |
| **Route Runtime** | `nodejs` or `edge` (both supported) | Requires `export const runtime = "edge"` |
| **ISR & Caching** | Native Workers KV / R2 caching | Limited KV caching |
| **Status** | **Recommended production standard** | Maintenance mode |

> [!NOTE]
> Because HUEXE includes file upload endpoints (`/api/upload`) and media streaming (`/api/media/[id]`) configured with `export const runtime = "nodejs"`, **OpenNext for Cloudflare (`@opennextjs/cloudflare`)** is the primary recommended deployment engine.

---

## 3. Code Mode MCP Paradigm & Automated Transforms

### 3.1 What is Code Mode MCP?
In standard Model Context Protocol (MCP) implementations, LLMs interact with external infrastructure by loading hundreds of discrete tool definitions and JSON schemas directly into the prompt. For large API surfaces like Cloudflare (2,500+ endpoints), this consumes **over 1.1 million tokens** purely on tool descriptions.

**Code Mode** (pioneered by Cloudflare and implemented locally by repositories like [`jx-codes/codemode-mcp`](https://github.com/jx-codes/codemode-mcp)) transforms this pattern:
1. **Code as the Interface:** Instead of calling separate tools one by one, the AI agent writes concise TypeScript/JavaScript code snippets that orchestrate APIs programmatically.
2. **Sandbox Execution:** The code executes inside a secured sandbox (Deno sandbox in `codemode-mcp` or Cloudflare Worker V8 isolates).
3. **Local HTTP Proxy:** The sandbox communicates with a lightweight proxy (`http://localhost:3001/mcp/*`) that routes requests directly to underlying tools (Wrangler, Cloudflare API, Git, PostgreSQL).
4. **99.9% Token Reduction:** Tool definitions drop from 1,000,000+ tokens to ~1,000 tokens. Intermediate query payloads stay in the sandbox, returning only final verification results.

### 3.2 Automated Transforms for Next.js & Cloudflare
Using Code Mode patterns, autonomous agents can automate the entire Cloudflare lifecycle:
- Provisioning Hyperdrive bindings and Cloudflare KV namespaces automatically via Wrangler REST APIs.
- Transforming `next.config.ts` and build scripts for zero-configuration Cloudflare compilation.
- Performing automated database migrations (`drizzle-kit push`) against remote connection strings.
- Continuous verification of security headers and live HTTP response codes post-deployment.

---

## 4. PostgreSQL at the Edge (Neon, Supabase, Hyperdrive)

Standard PostgreSQL clients create new TCP connections per request, which can cause latency bottlenecks and connection starvation when invoked from hundreds of global edge worker isolates.

### 4.1 Cloudflare Hyperdrive (Recommended)
Cloudflare **Hyperdrive** turns regional PostgreSQL databases into globally distributed, low-latency edge databases by maintaining pooled, pre-warmed connections across Cloudflare's network and caching SQL query results.

#### Step 1: Create the Hyperdrive configuration
Run the following command using the Wrangler CLI:
```bash
npx wrangler hyperdrive create huexe-db \
  --connection-string="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require"
```

Output:
```json
{
  "id": "7c34b68e91e44f87a8f3d64e9a8f2c31",
  "name": "huexe-db"
}
```

#### Step 2: Configure `wrangler.toml`
Add the generated Hyperdrive ID to your `wrangler.toml`:
```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "7c34b68e91e44f87a8f3d64e9a8f2c31"
localConnectionString = "postgresql://postgres:postgres@localhost:5432/huexe"
```

#### Step 3: Accessing Hyperdrive in Drizzle ORM
When deployed on Cloudflare Workers, the connection string is provided via `env.HYPERDRIVE.connectionString`. In local development, it falls back gracefully to `DATABASE_URL` or `localConnectionString`.

---

### 4.2 Neon Serverless Postgres
Neon offers autoscaling PostgreSQL with native connection pooling and instant branch cloning.

1. In the Neon Console, create a database project named `huexe-production`.
2. Select the **Pooled Connection** string (contains `-pooler` in the hostname):
   ```
   postgresql://alex:AbC123dEf@ep-cool-fog-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Set the connection string in Cloudflare:
   ```bash
   npx wrangler secret put DATABASE_URL
   ```
4. **Neon Preview Branches**: For CI/CD, create preview branches per pull request (`neon branches create`). Every PR gets an isolated, ephemeral PostgreSQL replica with zero overhead.

---

### 4.3 Supabase Postgres
When connecting HUEXE to a Supabase PostgreSQL instance:

1. Go to **Project Settings > Database > Connection String**.
2. Select **Transaction Pooler** (Port `6543`) or **Session Pooler** (Port `5432` with IPv4 support).
3. Ensure the connection string includes `sslmode=require`:
   ```
   postgresql://postgres.your-project-id:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
4. Configure as a Cloudflare secret:
   ```bash
   npx wrangler secret put DATABASE_URL
   ```

---

## 5. Security & Edge Routing Configuration

### 5.1 Security Headers (`public/_headers`)
HUEXE enforces strict HTTP security headers designed specifically for high-fashion multimedia streaming:
- **Content-Security-Policy (CSP):** Permits GSAP animation hydration, WebGL canvas rendering, Google Fonts, and high-resolution media from Pexels and Unsplash CDNs.
- **HSTS:** `max-age=31536000; includeSubDomains; preload` (enforces HTTPS globally for 1 year).
- **X-Content-Type-Options:** `nosniff` (mitigates MIME-confusion attacks).
- **X-Frame-Options:** `DENY` (prevents clickjacking).
- **Permissions-Policy:** Explicitly disables microphone, camera, geolocation, and USB.
- **Cache-Control:**
  - `/_next/static/*`: 1-year immutable caching (`max-age=31536000, immutable`).
  - `/api/media/*`: 24-hour browser caching with 7-day stale-while-revalidate.
  - `/admin/*`: Strict `no-store, no-cache` to ensure administrative data is never cached by intermediate proxies.

### 5.2 Edge Redirects (`public/_redirects`)
- **Apex Domain Canonicalization:** Automatically forces `https://www.huexe.co/*` to `https://huexe.co/:splat` with HTTP 301.
- **Editorial Deep Links:** Maps vanity paths like `/models`, `/roster`, `/digitals`, and `/production` directly to their respective interactive landing page anchors.

---

## 6. Step-by-Step Deployment Workflows

### Method A: Automated Deployment via Cloudflare Dashboard (Recommended)

1. **Push your repository** to GitHub or GitLab.
2. In the **Cloudflare Dashboard**, navigate to **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
3. Select the `huexe-high-fashion-website` repository.
4. Set the **Build Configuration**:
   - **Framework preset:** `Next.js`
   - **Build command:** `npx @opennextjs/cloudflare build` (or `npx @cloudflare/next-on-pages` if using Next-on-Pages)
   - **Build output directory:** `.open-next/assets` (or `.vercel/output/static`)
   - **Node.js version:** `20.x` or `22.x`
5. Set **Environment Variables**:
   - `NODE_VERSION` = `20.18.0`
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_SITE_URL` = `https://huexe.co`
6. Set **Production Secrets**:
   - Navigate to **Settings > Variables and Secrets**.
   - Add encrypted secret `DATABASE_URL` (your pooled Neon, Supabase, or Hyperdrive connection string).
   - Add encrypted secret `ADMIN_PASSWORD` (strong studio master password).
7. Under **Settings > Functions > Compatibility Flags**, ensure `nodejs_compat` is enabled and set compatibility date to `2025-02-15` or later.
8. Click **Save and Deploy**.

---

### Method B: Direct CLI Deployment via Wrangler & OpenNext

For high-speed deployments directly from your terminal or CI/CD runner:

#### 1. Install Cloudflare OpenNext Adapter
```bash
npm install -D @opennextjs/cloudflare@latest wrangler@latest
```

#### 2. Apply Database Migrations
Before deploying the application, push the schema to your remote database:
```bash
DATABASE_URL="postgresql://..." npx drizzle-kit push
```
*(Alternatively, execute `sql/001_huexe_schema.sql` directly inside the Neon / Supabase SQL Editor).*

#### 3. Inject Production Secrets
```bash
npx wrangler secret put DATABASE_URL
# When prompted, paste: postgresql://...

npx wrangler secret put ADMIN_PASSWORD
# When prompted, paste your secure studio password
```

#### 4. Build the Project with OpenNext
```bash
npx @opennextjs/cloudflare build
```

#### 5. Deploy to Cloudflare
```bash
npx wrangler deploy
```

---

## 7. Database Initialization & Admin Access

### 7.1 Automatic First-Boot Seeding
The application features an **idempotent auto-seed mechanism** located in `src/db/seed.ts`. 

Upon the first request to the production URL:
1. The 10 editorial models (Aarthi, Meera, Ilhaam, Nadia, Reyan, Maya, Tariq, Zoya, Dev, Farhan) are seeded into the `models` table.
2. The 3 showcase portfolio campaigns (Raw Silk Monolith, Nocturne Horizon, Kinetic Khadi) are seeded into `portfolio_campaigns`.
3. Default inquiries and applications are created.
4. The primary admin account is registered:
   - **Email:** `studio@huexe.co`
   - **Default Password:** Value of `process.env.ADMIN_PASSWORD` (or `huexe2026` if unset).
   - **Role:** `owner`

### 7.2 Accessing the CMS
- Navigate to `https://huexe.co/admin` (or `https://<your-project>.pages.dev/admin`).
- Log in with `studio@huexe.co` and your administrative password.
- You can manage:
  - **Talent Roster:** Create/edit models, adjust measurements, upload polaroids, toggle featured status.
  - **Portfolio Campaigns:** Add client campaigns, assign credits, link showreel preview videos.
  - **Scouting Applications:** Review submitted digitals, filter applicant status (Reviewing, Shortlisted, Signed, Archived).
  - **B2B Inquiries:** Manage casting, production, and licensing requests from international luxury brands.
  - **Team:** Invite and manage team accounts with role-based permissions (`owner`, `editor`, `scout`).

---

## 8. High-Performance Media Architecture

| Media Asset | Delivery Strategy | Edge Acceleration |
|---|---|---|
| **Editorial Showreel Videos** | Pexels UHD CDN (4K/25fps) | Cloudflare Edge Caching via `_headers` |
| **Model Portfolios & Polaroids** | Pexels High-Resolution CDN | AVIF / WebP transformation, `Cache-Control: max-age=604800` |
| **Bespoke Uploaded Media** | Stored in `media_assets` table | Streamed via `/api/media/[id]` with 24h browser cache |
| **WebGL Hero Shaders** | Native GLSL compiled on client canvas | Zero external 3D libraries, pure 60fps GPU acceleration |
| **Static Fonts & Bundles** | Cloudflare Global CDN | `Cache-Control: immutable, max-age=31536000` |

---

## 9. Operational Verification Checklist

Before publishing your production domain:

- [ ] **DNS Records:** Apex domain `A`/`AAAA` or `CNAME` pointing to Cloudflare with Orange Cloud (Proxy) enabled.
- [ ] **SSL/TLS Mode:** Set to **Full (Strict)** in Cloudflare SSL/TLS Settings.
- [ ] **Security Headers:** Run `curl -I https://huexe.co` and verify `Strict-Transport-Security`, `Content-Security-Policy`, and `X-Frame-Options` headers are present.
- [ ] **Database Connectivity:** Verify `/api/health` returns status `200 OK` and database ping succeeds.
- [ ] **Talent Dynamic Routes:** Open `https://huexe.co/talent/aarthi-venkatesh` and verify model biography and gallery images load.
- [ ] **Comp Card Generator:** Test `https://huexe.co/talent/aarthi-venkatesh/comp-card` and verify printable comp-card renders.
- [ ] **Admin Authentication:** Verify session cookie `huexe_admin_session` is set with `HttpOnly`, `SameSite=Lax`, and `Secure` attributes.
- [ ] **Robots & Sitemap:** Verify `https://huexe.co/robots.txt` and `https://huexe.co/sitemap.xml` are accessible.
