import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  ensureSeeded,
  FALLBACK_APPLICATIONS,
  FALLBACK_CAMPAIGNS,
  FALLBACK_INQUIRIES,
  FALLBACK_MODELS,
} from "@/db/seed";
import {
  b2bInquiries,
  models,
  portfolioCampaigns,
  scoutingApplications,
  siteSettings,
  type CampaignRecord,
  type ModelRecord,
} from "@/db/schema";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await ensureSeeded();
    return await fn();
  } catch (error) {
    console.warn("[huexe:db] Query fallback engaged:", (error as Error)?.message || error);
    return fallback;
  }
}

export async function getPublishedModels(): Promise<ModelRecord[]> {
  const result = await safe(
    () =>
      db
        .select()
        .from(models)
        .where(eq(models.status, "published"))
        .orderBy(desc(models.isFeatured), models.sortOrder, models.name),
    FALLBACK_MODELS,
  );
  return result && result.length > 0 ? result : FALLBACK_MODELS;
}

export async function getModelBySlug(slug: string): Promise<ModelRecord | null> {
  const record = await safe(async () => {
    const rows = await db
      .select()
      .from(models)
      .where(and(eq(models.slug, slug), eq(models.status, "published")))
      .limit(1);
    return rows[0] ?? null;
  }, null);

  if (record) return record;
  return FALLBACK_MODELS.find((m) => m.slug === slug) ?? null;
}

export async function getPublishedCampaigns(): Promise<CampaignRecord[]> {
  const result = await safe(
    () =>
      db
        .select()
        .from(portfolioCampaigns)
        .where(eq(portfolioCampaigns.status, "published"))
        .orderBy(desc(portfolioCampaigns.publishedAt)),
    FALLBACK_CAMPAIGNS,
  );
  return result && result.length > 0 ? result : FALLBACK_CAMPAIGNS;
}

export async function getAllModels(): Promise<ModelRecord[]> {
  const result = await safe(
    () => db.select().from(models).orderBy(models.sortOrder, desc(models.createdAt)),
    FALLBACK_MODELS,
  );
  return result && result.length > 0 ? result : FALLBACK_MODELS;
}

export async function getAllCampaigns(): Promise<CampaignRecord[]> {
  const result = await safe(
    () => db.select().from(portfolioCampaigns).orderBy(desc(portfolioCampaigns.publishedAt)),
    FALLBACK_CAMPAIGNS,
  );
  return result && result.length > 0 ? result : FALLBACK_CAMPAIGNS;
}

export async function getApplications(): Promise<typeof FALLBACK_APPLICATIONS> {
  const result = await safe(
    () => db.select().from(scoutingApplications).orderBy(desc(scoutingApplications.submittedAt)),
    FALLBACK_APPLICATIONS,
  );
  return result && result.length > 0 ? result : FALLBACK_APPLICATIONS;
}

export async function getInquiries(): Promise<typeof FALLBACK_INQUIRIES> {
  const result = await safe(
    () => db.select().from(b2bInquiries).orderBy(desc(b2bInquiries.createdAt)),
    FALLBACK_INQUIRIES,
  );
  return result && result.length > 0 ? result : FALLBACK_INQUIRIES;
}

export async function getDashboardStats() {
  return safe(
    async () => {
      const [modelCount] = await db
        .select({
          total: sql<number>`count(*)::int`,
          published: sql<number>`count(*) filter (where status = 'published')::int`,
        })
        .from(models);
      const [campaignCount] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(portfolioCampaigns);
      const [appCount] = await db
        .select({
          total: sql<number>`count(*)::int`,
          pending: sql<number>`count(*) filter (where status = 'Pending Review')::int`,
          shortlisted: sql<number>`count(*) filter (where status = 'Shortlisted')::int`,
        })
        .from(scoutingApplications);
      const [inquiryCount] = await db
        .select({
          total: sql<number>`count(*)::int`,
          open: sql<number>`count(*) filter (where status <> 'Closed')::int`,
        })
        .from(b2bInquiries);
      return {
        models: modelCount?.total ?? FALLBACK_MODELS.length,
        publishedModels: modelCount?.published ?? FALLBACK_MODELS.length,
        campaigns: campaignCount?.total ?? FALLBACK_CAMPAIGNS.length,
        applications: appCount?.total ?? 0,
        pending: appCount?.pending ?? 0,
        shortlisted: appCount?.shortlisted ?? 0,
        inquiries: inquiryCount?.total ?? 0,
        openInquiries: inquiryCount?.open ?? 0,
      };
    },
    {
      models: FALLBACK_MODELS.length,
      publishedModels: FALLBACK_MODELS.length,
      campaigns: FALLBACK_CAMPAIGNS.length,
      applications: 0,
      pending: 0,
      shortlisted: 0,
      inquiries: 0,
      openInquiries: 0,
    },
  );
}

export async function getModelById(id: string): Promise<ModelRecord | null> {
  const record = await safe(async () => {
    const rows = await db.select().from(models).where(eq(models.id, id)).limit(1);
    return rows[0] ?? null;
  }, null);

  if (record) return record;
  return FALLBACK_MODELS.find((m) => m.id === id) ?? null;
}

export async function getCampaignById(id: string): Promise<CampaignRecord | null> {
  const record = await safe(async () => {
    const rows = await db
      .select()
      .from(portfolioCampaigns)
      .where(eq(portfolioCampaigns.id, id))
      .limit(1);
    return rows[0] ?? null;
  }, null);

  if (record) return record;
  return FALLBACK_CAMPAIGNS.find((c) => c.id === id) ?? null;
}

/* ------------------------------------------------------------------ */
/*  SITE SETTINGS (SEO, Social, Email, WhatsApp)                      */
/* ------------------------------------------------------------------ */

export type SiteSettingsMap = {
  seo_gtag_id: string;
  seo_ga_id: string;
  seo_clarity_id: string;
  social_instagram: string;
  social_twitter: string;
  social_linkedin: string;
  social_tiktok: string;
  social_youtube: string;
  whatsapp_number: string;
  whatsapp_message: string;
  resend_api_key: string;
  resend_from_email: string;
  admin_notification_email: string;
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  cloudinary_api_secret: string;
  cloudinary_folder: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsMap = {
  seo_gtag_id: "",
  seo_ga_id: "",
  seo_clarity_id: "",
  social_instagram: "https://instagram.com/huexe",
  social_twitter: "https://x.com/huexe",
  social_linkedin: "https://linkedin.com/company/huexe",
  social_tiktok: "https://tiktok.com/@huexe",
  social_youtube: "https://youtube.com/@huexe",
  whatsapp_number: "+919876543210",
  whatsapp_message: "Hello Manasa, I would like to inquire about booking & casting at HUEXE.",
  resend_api_key: "",
  resend_from_email: "HUEXE Studio <onboarding@resend.dev>",
  admin_notification_email: "studio@huexe.co",
  cloudinary_cloud_name: "",
  cloudinary_api_key: "",
  cloudinary_api_secret: "",
  cloudinary_folder: "huexe-production",
};

let inMemorySettings: SiteSettingsMap = { ...DEFAULT_SITE_SETTINGS };

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  return await safe(async () => {
    const rows = await db.select().from(siteSettings);
    if (!rows || rows.length === 0) return inMemorySettings;
    const map = { ...inMemorySettings };
    for (const row of rows) {
      if (row.key in map) {
        (map as Record<string, string>)[row.key] = row.value;
      }
    }
    return map;
  }, inMemorySettings);
}

/** Returns sanitized settings safe for public client hydration (scrubs all API keys & secrets). */
export async function getPublicSiteSettings() {
  const all = await getSiteSettings();
  return {
    seo_gtag_id: all.seo_gtag_id,
    seo_ga_id: all.seo_ga_id,
    seo_clarity_id: all.seo_clarity_id,
    social_instagram: all.social_instagram,
    social_twitter: all.social_twitter,
    social_linkedin: all.social_linkedin,
    social_tiktok: all.social_tiktok,
    social_youtube: all.social_youtube,
    whatsapp_number: all.whatsapp_number,
    whatsapp_message: all.whatsapp_message,
    cloudinary_cloud_name: all.cloudinary_cloud_name,
    cloudinary_folder: all.cloudinary_folder,
  };
}

export async function setSiteSettings(newSettings: Partial<SiteSettingsMap>): Promise<SiteSettingsMap> {
  inMemorySettings = { ...inMemorySettings, ...newSettings };
  await safe(async () => {
    for (const [key, value] of Object.entries(newSettings)) {
      if (value !== undefined) {
        const valStr = String(value);
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
        if (existing.length > 0) {
          await db
            .update(siteSettings)
            .set({ value: valStr, updatedAt: new Date() })
            .where(eq(siteSettings.key, key));
        } else {
          await db.insert(siteSettings).values({ key, value: valStr });
        }
      }
    }
    return true;
  }, false);
  return inMemorySettings;
}

