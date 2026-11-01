import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { TalentView, type TalentData } from "@/components/talent/TalentView";
import { getModelBySlug, getPublicSiteSettings } from "@/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) return { title: "Talent not found" };

  const description =
    model.bio ??
    `${model.name} — ${model.category} board at Huexe, a South India based global mother agency.`;

  return {
    title: `${model.name} — ${model.category}`,
    description,
    openGraph: {
      title: `${model.name} — HUEXE`,
      description,
      images: [{ url: model.featuredImage, width: 1000, height: 1500, alt: model.name }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${model.name} — HUEXE`,
      description,
      images: [model.featuredImage],
    },
  };
}

export default async function TalentPage({ params }: Props) {
  const { slug } = await params;
  const [record, settings] = await Promise.all([
    getModelBySlug(slug),
    getPublicSiteSettings(),
  ]);
  if (!record) notFound();

  const model: TalentData = {
    id: record.id,
    name: record.name,
    slug: record.slug,
    category: record.category,
    location: record.location,
    bio: record.bio,
    stats: record.stats ?? {},
    featuredImage: record.featuredImage,
    hoverPolaroid: record.hoverPolaroid,
    galleryImages: record.galleryImages ?? [],
    polaroidImages: record.polaroidImages ?? [],
    instagram: record.instagram,
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: model.name,
    jobTitle: "Fashion Model",
    image: model.featuredImage,
    height: model.stats.height,
    homeLocation: model.location,
    worksFor: { "@type": "Organization", name: "HUEXE" },
  };

  const socials = {
    instagram: settings.social_instagram,
    twitter: settings.social_twitter,
    linkedin: settings.social_linkedin,
    tiktok: settings.social_tiktok,
    youtube: settings.social_youtube,
  };

  return (
    <SiteShell
      socials={socials}
      whatsappNumber={settings.whatsapp_number}
      whatsappMessage={settings.whatsapp_message}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <TalentView model={model} />
    </SiteShell>
  );
}
