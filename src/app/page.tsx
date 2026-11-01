import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Narrative } from "@/components/sections/Narrative";
import { Roster, type RosterModel } from "@/components/sections/Roster";
import { Services, type ServiceCampaign } from "@/components/sections/Services";
import { Apply } from "@/components/sections/Apply";
import { getPublishedCampaigns, getPublishedModels, getPublicSiteSettings } from "@/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [modelRows, campaignRows, settings] = await Promise.all([
    getPublishedModels(),
    getPublishedCampaigns(),
    getPublicSiteSettings(),
  ]);

  const models: RosterModel[] = modelRows.map((model) => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    category: model.category,
    location: model.location,
    featuredImage: model.featuredImage,
    hoverPolaroid: model.hoverPolaroid,
    stats: model.stats ?? {},
    isFeatured: model.isFeatured,
  }));

  const campaigns: ServiceCampaign[] = campaignRows.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    clientBrand: campaign.clientBrand,
    category: campaign.category,
    coverMediaUrl: campaign.coverMediaUrl,
    previewVideoUrl: campaign.previewVideoUrl,
    summary: campaign.summary,
  }));

  const socials = {
    instagram: settings.social_instagram,
    twitter: settings.social_twitter,
    linkedin: settings.social_linkedin,
    tiktok: settings.social_tiktok,
    youtube: settings.social_youtube,
  };

  return (
    <SiteShell
      showPreloader
      socials={socials}
      whatsappNumber={settings.whatsapp_number}
      whatsappMessage={settings.whatsapp_message}
    >
      <Hero />
      <Marquee />
      <About />
      <Narrative />
      <Roster models={models} />
      <Services campaigns={campaigns} />
      <Apply />
    </SiteShell>
  );
}

function Marquee() {
  const items = [
    "Mother agency",
    "Global event casting",
    "Turnkey remote production",
    "Portfolio development",
    "Overseas placement",
    "Scouting & grooming",
  ];
  return (
    <div className="overflow-hidden border-y border-raw/10 bg-obsidian py-5">
      <div className="marquee-track">
        {Array.from({ length: 2 }).map((_, loop) => (
          <div key={loop} className="flex shrink-0">
            {items.map((item) => (
              <span key={`${loop}-${item}`} className="mono flex items-center text-raw/45">
                <span className="px-6">{item}</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
