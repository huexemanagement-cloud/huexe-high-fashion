import type { MetadataRoute } from "next";
import { getPublishedModels } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://huexe.co";
  const models = await getPublishedModels();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...models.map((model) => ({
      url: `${base}/talent/${model.slug}`,
      lastModified: model.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
