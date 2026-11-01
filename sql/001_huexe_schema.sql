-- ============================================================================
--  HUEXE — CMS SCHEMA MIGRATION
--  Target: PostgreSQL 14+ (runs as-is on local Postgres and on Supabase)
--  Apply:  psql $DATABASE_URL -f sql/001_huexe_schema.sql
--  (The running app uses Drizzle: `npx drizzle-kit push` produces the same shape)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- MODELS ---
create table if not exists models (
  id              uuid primary key default gen_random_uuid(),
  name            varchar(160) not null,
  slug            varchar(180) not null unique,
  category        varchar(40)  not null default 'New Faces',  -- Runway | Editorial | Commercial | New Faces
  location        varchar(160) default 'Chennai, IN',
  bio             text,
  stats           jsonb        not null default '{}'::jsonb,  -- {height,bust,chest,waist,hips,shoe,hair,eyes}
  featured_image  text         not null,
  hover_polaroid  text,
  gallery_images  jsonb        not null default '[]'::jsonb,
  polaroid_images jsonb        not null default '[]'::jsonb,
  instagram       varchar(120),
  is_featured     boolean      not null default false,
  status          varchar(20)  not null default 'published',  -- published | draft
  sort_order      integer      not null default 0,
  created_at      timestamptz  not null default now()
);
create index if not exists models_status_idx on models (status);

-- --------------------------------------------------- PORTFOLIO CAMPAIGNS ---
create table if not exists portfolio_campaigns (
  id                uuid primary key default gen_random_uuid(),
  title             varchar(200) not null,
  client_brand      varchar(160) not null,
  category          varchar(48)  not null default 'Editorial', -- Editorial | Lookbook | Runway | Remote Production
  cover_media_url   text         not null,
  media_type        varchar(12)  not null default 'image',     -- image | video
  preview_video_url text,
  summary           text,
  gallery           jsonb        not null default '[]'::jsonb,
  credits           jsonb        not null default '{}'::jsonb, -- {photographer,stylist,direction,location,talent}
  status            varchar(20)  not null default 'published',
  published_at      timestamptz  not null default now()
);

-- -------------------------------------------------- SCOUTING APPLICATIONS ---
create table if not exists scouting_applications (
  id             uuid primary key default gen_random_uuid(),
  full_name      varchar(160) not null,
  email          varchar(180) not null,
  phone          varchar(60),
  instagram      varchar(120),
  location       varchar(160),
  age            integer,
  measurements   jsonb       not null default '{}'::jsonb, -- {heightCm,heightFt,bust,waist,hips,shoe}
  digitals_urls  jsonb       not null default '{}'::jsonb, -- {headshot,profile,fullLength,walkVideo}
  status         varchar(32) not null default 'Pending Review', -- Pending Review | Shortlisted | Contacted | Archived
  internal_notes text,
  submitted_at   timestamptz not null default now()
);

-- ------------------------------------------------------------ B2B INQUIRIES -
create table if not exists b2b_inquiries (
  id               uuid primary key default gen_random_uuid(),
  company_name     varchar(180) not null,
  contact_name     varchar(160) not null,
  email            varchar(180) not null,
  service_type     varchar(48)  not null default 'Talent Booking', -- Talent Booking | Event Casting | Turnkey Remote Production
  requested_models jsonb        not null default '[]'::jsonb,      -- array of model ids
  project_brief    text,
  status           varchar(32)  not null default 'New',            -- New | In Discussion | Confirmed | Closed
  created_at       timestamptz  not null default now()
);

-- ------------------------------------------------------------ MEDIA ASSETS -
-- Self-hosted equivalent of a private Supabase Storage bucket. Files are served
-- through the authenticated route /api/media/[id].
create table if not exists media_assets (
  id          uuid primary key default gen_random_uuid(),
  bucket      varchar(40)  not null default 'digitals',  -- digitals | cms
  filename    varchar(260) not null,
  mime_type   varchar(120) not null,
  byte_size   integer      not null default 0,
  data_base64 text         not null,
  created_at  timestamptz  not null default now()
);

-- ------------------------------------------------------- AUTH / RBAC -------
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         varchar(180) not null unique,
  name          varchar(160) not null,
  role          varchar(24)  not null default 'editor', -- owner | editor | scout
  password_hash text         not null,                   -- scrypt: salt:key
  created_at    timestamptz  not null default now()
);

create table if not exists admin_sessions (
  token      varchar(96) primary key,
  user_id    uuid not null references admin_users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
--  SUPABASE PARITY (optional — run only on Supabase)
-- ============================================================================
-- 1. Storage buckets
--    insert into storage.buckets (id, name, public) values
--      ('talent-portfolios', 'talent-portfolios', true),
--      ('scouting-digitals', 'scouting-digitals', false)
--    on conflict do nothing;
--
-- 2. Row Level Security
--    alter table models                enable row level security;
--    alter table portfolio_campaigns   enable row level security;
--    alter table scouting_applications enable row level security;
--    alter table b2b_inquiries         enable row level security;
--
--    create policy "public reads published talent" on models
--      for select using (status = 'published');
--    create policy "public reads published work" on portfolio_campaigns
--      for select using (status = 'published');
--    create policy "anyone can submit digitals" on scouting_applications
--      for insert with check (true);
--    create policy "anyone can submit a brief" on b2b_inquiries
--      for insert with check (true);
--    create policy "staff manage everything" on models
--      for all using (auth.jwt() ->> 'role' in ('owner','editor'));
--
-- 3. Private digitals policy
--    create policy "staff read digitals" on storage.objects
--      for select using (
--        bucket_id = 'scouting-digitals'
--        and auth.jwt() ->> 'role' in ('owner','editor','scout')
--      );
