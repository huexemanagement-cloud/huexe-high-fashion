import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  CMS — TALENT ROSTER                                                */
/* ------------------------------------------------------------------ */

export type ModelStats = {
  height?: string;
  bust?: string;
  chest?: string;
  waist?: string;
  hips?: string;
  shoe?: string;
  hair?: string;
  eyes?: string;
};

export const models = pgTable(
  "models",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    category: varchar("category", { length: 40 }).notNull().default("New Faces"),
    location: varchar("location", { length: 160 }).default("Chennai, IN"),
    bio: text("bio"),
    stats: jsonb("stats").$type<ModelStats>().notNull().default({}),
    featuredImage: text("featured_image").notNull(),
    hoverPolaroid: text("hover_polaroid"),
    galleryImages: jsonb("gallery_images").$type<string[]>().notNull().default([]),
    polaroidImages: jsonb("polaroid_images").$type<string[]>().notNull().default([]),
    instagram: varchar("instagram", { length: 120 }),
    isFeatured: boolean("is_featured").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("models_status_idx").on(table.status)],
);

/* ------------------------------------------------------------------ */
/*  CMS — PORTFOLIO / CAMPAIGNS                                        */
/* ------------------------------------------------------------------ */

export type CampaignCredits = {
  photographer?: string;
  stylist?: string;
  direction?: string;
  location?: string;
  talent?: string;
};

export const portfolioCampaigns = pgTable("portfolio_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  clientBrand: varchar("client_brand", { length: 160 }).notNull(),
  category: varchar("category", { length: 48 }).notNull().default("Editorial"),
  coverMediaUrl: text("cover_media_url").notNull(),
  mediaType: varchar("media_type", { length: 12 }).notNull().default("image"),
  previewVideoUrl: text("preview_video_url"),
  summary: text("summary"),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  credits: jsonb("credits").$type<CampaignCredits>().notNull().default({}),
  status: varchar("status", { length: 20 }).notNull().default("published"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  SCOUTING PIPELINE — "SUBMIT YOUR DIGITALS"                         */
/* ------------------------------------------------------------------ */

export type Measurements = {
  heightCm?: string;
  heightFt?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoe?: string;
};

export type DigitalsUrls = {
  headshot?: string;
  profile?: string;
  fullLength?: string;
  walkVideo?: string;
};

export const scoutingApplications = pgTable("scouting_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  instagram: varchar("instagram", { length: 120 }),
  location: varchar("location", { length: 160 }),
  age: integer("age"),
  measurements: jsonb("measurements").$type<Measurements>().notNull().default({}),
  digitalsUrls: jsonb("digitals_urls").$type<DigitalsUrls>().notNull().default({}),
  status: varchar("status", { length: 32 }).notNull().default("Pending Review"),
  internalNotes: text("internal_notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  B2B INQUIRIES — BOOKINGS / CASTING / REMOTE PRODUCTION             */
/* ------------------------------------------------------------------ */

export const b2bInquiries = pgTable("b2b_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: varchar("company_name", { length: 180 }).notNull(),
  contactName: varchar("contact_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  serviceType: varchar("service_type", { length: 48 }).notNull().default("Talent Booking"),
  requestedModels: jsonb("requested_models").$type<string[]>().notNull().default([]),
  projectBrief: text("project_brief"),
  status: varchar("status", { length: 32 }).notNull().default("New"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  MEDIA STORAGE (private bucket equivalent)                          */
/* ------------------------------------------------------------------ */

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  bucket: varchar("bucket", { length: 40 }).notNull().default("digitals"),
  filename: varchar("filename", { length: 260 }).notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  byteSize: integer("byte_size").notNull().default(0),
  dataBase64: text("data_base64").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  AUTH — ROLE BASED ADMIN ACCESS                                     */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 24 }).notNull().default("editor"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  token: varchar("token", { length: 96 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  SITE SETTINGS (SEO, Social, Email, WhatsApp)                      */
/* ------------------------------------------------------------------ */

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ModelRecord = typeof models.$inferSelect;
export type CampaignRecord = typeof portfolioCampaigns.$inferSelect;
export type ApplicationRecord = typeof scoutingApplications.$inferSelect;
export type InquiryRecord = typeof b2bInquiries.$inferSelect;
export type AdminUserRecord = typeof adminUsers.$inferSelect;
export type SiteSettingRecord = typeof siteSettings.$inferSelect;
