# HUEXE — Mother Agency & Remote Production Studio

A high-fashion animated motion website + bespoke CMS for **HUEXE**, a South India based global
mother agency and turnkey remote production studio.

## Stack

| Layer      | Tech |
| ---------- | ---- |
| Framework  | Next.js 16 (App Router, TypeScript, Server Actions) |
| Styling    | Tailwind CSS v4 + CSS variables, fluid `clamp()` type scale |
| Motion     | GSAP (ScrollTrigger · Flip · SplitText), Lenis inertial scroll synced to `gsap.ticker`, Framer Motion for drawers/modals |
| WebGL      | Raw WebGL hero shader (ripple displacement + RGB split + grain), zero 3D dependencies |
| Data / CMS | PostgreSQL + Drizzle ORM, bespoke `/admin` dashboard, cookie sessions with scrypt hashing |
| Media      | `media_assets` table acting as a private storage bucket, streamed via `/api/media/[id]` |

## Project structure

```
sql/001_huexe_schema.sql        Full SQL migration (+ Supabase bucket/RLS parity notes)
src/db/schema.ts                Drizzle tables: models, portfolio_campaigns,
                                scouting_applications, b2b_inquiries, media_assets,
                                admin_users, admin_sessions
src/db/queries.ts               Read models with safe fallbacks
src/db/seed.ts                  Idempotent roster/campaign/admin seed
src/lib/{auth,gsap,media,utils}.ts
src/app/page.tsx                Home — all six editorial sections
src/app/talent/[slug]/          Model profile + /comp-card PDF generator
src/app/admin/login             Studio auth
src/app/admin/(dash)/           Overview · Roster · Portfolio · Pipeline · B2B · Team
src/app/api/upload              Multipart upload into the private bucket
src/app/api/media/[id]          Streams stored media
src/components/sections/        Hero (WebGL) · About (pinned) · Narrative (horizontal)
                                Roster (GSAP Flip filtering) · Services · Apply
src/components/apply/           Multi-step "Submit your digitals" drawer + dropzones
src/components/admin/           CMS forms & fields
```

## Local run

```bash
npm install
npx drizzle-kit push      # create tables
npm run build && npm start
```

The roster, portfolio, demo applications and the owner account are seeded automatically on the
first request.

## Admin access

```
URL:      /admin
Email:    studio@huexe.co
Password: huexe2026        (override with ADMIN_PASSWORD before first boot)
```

Roles: `owner` (full access + team management), `editor` (roster, portfolio, pipeline),
`scout` (pipeline review).

## Motion choreography

1. **Preloader** — `00 — 100%` counter, then a vertical shutter split reveals the hero.
2. **Hero** — WebGL crossfade shader with pointer ripple, masked SplitText line reveals, parallax.
3. **About** — pinned left column, parallax editorial plates, kinetic philosophy quote.
4. **Narrative** — pinned horizontal scroll, light → obsidian colour transition, parallax numerals.
5. **Roster** — GSAP Flip filter transitions, hover crossfade to polaroid + monospace spec bar.
6. **Apply** — multi-step drawer, drag & drop digitals with silhouette guides, direct upload.
