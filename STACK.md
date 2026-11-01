# HUEXE Technology Stack

| Layer | Component | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js App Router | 16.2.6 | React 19.2.6, Server Actions, Server Components |
| **Styling** | Tailwind CSS | v4.1.17 | PostCSS `@tailwindcss/postcss`, Fluid clamp typography |
| **Motion** | GSAP | 3.15.0 | ScrollTrigger, Flip, Lenis inertial scroll integration |
| **Animation UI** | Framer Motion | 14.4.0 | Modals, drawers, and dynamic interactive overlays |
| **Shader/WebGL** | Raw WebGL Canvas | - | Ripple displacement, RGB split, chromatic grain, zero 3D libs |
| **Database** | PostgreSQL + Drizzle ORM | Drizzle 0.45.2 | Supports Local PG, Neon Serverless, Supabase, Cloudflare Hyperdrive |
| **Deployment** | Cloudflare Pages / Workers | - | Wrangler, edge runtime compatibility, `_headers`, `_redirects` |
| **Auth** | Native Secure Cookie Session | - | Node crypto `scryptSync`, `timingSafeEqual`, HttpOnly, SameSite |
| **Media** | Edge Stream & Media Assets | - | `media_assets` storage, streamed via `/api/media/[id]` |

