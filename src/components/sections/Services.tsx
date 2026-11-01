"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { B2BForm } from "@/components/sections/B2BForm";
import { BLUR_DATA_URL, SHOWREEL } from "@/lib/media";
import { cn } from "@/lib/utils";

export type ServiceCampaign = {
  id: string;
  title: string;
  clientBrand: string;
  category: string;
  coverMediaUrl: string;
  previewVideoUrl: string | null;
  summary: string | null;
};

const PILLARS = [
  {
    key: "what",
    label: "Mother Agency & Board",
    copy: "Representing exceptional South Asian runway and editorial talent. Direct development, international placement, and portfolio direction.",
    points: ["Runway Board", "Editorial Development", "International Desk"],
    media: SHOWREEL[0],
  },
  {
    key: "specialty",
    label: "Global Event Casting",
    copy: "Casting direction and lineup management for fashion weeks and private atelier presentations in Paris, Milan, Dubai, and Mumbai.",
    points: ["Show Lineups", "Fitting Coordination", "Direct Optioning"],
    media: SHOWREEL[1],
  },
  {
    key: "why",
    label: "Turnkey Remote Shoots",
    copy: "High-volume catalogue and lookbook execution from South India. International art direction, studio sets, lighting, and final delivery.",
    points: ["Full Production", "Retouch & Master", "Direct Delivery"],
    media: SHOWREEL[2],
  },
];

export function Services({ campaigns }: { campaigns: ServiceCampaign[] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative border-t border-raw/10 bg-obsidian py-28">
      <div className="edge-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="mono text-[11px] tracking-[0.26em] text-raw/40 uppercase">
              Production &amp; Casting // Client Services
            </p>
            <Reveal as="h2" className="display-xl mt-6 text-raw">
              Turnkey from
              <br />
              casting to delivery.
            </Reveal>
          </div>
          <Reveal className="mono max-w-sm leading-relaxed text-raw/45">
            <p>
              One contract. One production line. Talent, direction, studio, retouch and delivery —
              operated from South India for brands anywhere.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="divide-y divide-raw/10 border-y border-raw/10">
            {PILLARS.map((pillar, index) => {
              const open = active === index;
              return (
                <button
                  key={pillar.key}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                  data-cursor-variant="ring"
                  className="block w-full py-7 text-left"
                >
                  <div className="flex items-center justify-between gap-6">
                    <h3
                      className={cn(
                        "display-lg transition-colors duration-500",
                        open ? "text-raw" : "text-raw/30",
                      )}
                    >
                      {pillar.label}
                    </h3>
                    <span className="mono text-raw/30">0{index + 1}</span>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-xl text-raw/65">{pillar.copy}</p>
                      <ul className="mono mt-5 flex flex-wrap gap-2">
                        {pillar.points.map((point) => (
                          <li key={point} className="border border-raw/20 px-3 py-1.5 text-raw/50">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-raw/10 lg:aspect-auto lg:min-h-[520px]">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.key}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  active === index ? "opacity-70" : "opacity-0",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pillar.media.poster}
                  alt={pillar.label}
                  className="h-full w-full object-cover"
                />
                {active === index ? (
                  <video
                    src={pillar.media.video}
                    poster={pillar.media.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="none"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
            <div className="mono absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-raw/60">
              <span>Live from the floor</span>
              <span>REC ●</span>
            </div>
          </div>
        </div>

        {/* Campaign bento — CMS driven */}
        <div className="mt-24">
          <div className="mono flex items-end justify-between border-b border-raw/10 pb-5 text-raw/35">
            <span>Selected production &amp; casting work</span>
            <span>{campaigns.length} projects</span>
          </div>

          <div className="mt-8 grid auto-rows-[minmax(220px,auto)] grid-cols-2 gap-4 md:grid-cols-4">
            {campaigns.map((campaign, index) => (
              <CampaignTile
                key={campaign.id}
                campaign={campaign}
                className={cn(
                  index === 0 && "col-span-2 row-span-2",
                  index === 3 && "md:col-span-2",
                )}
              />
            ))}
          </div>
        </div>

        <B2BForm />
      </div>
    </section>
  );
}

function CampaignTile({
  campaign,
  className,
}: {
  campaign: ServiceCampaign;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <article
      onMouseEnter={() => videoRef.current?.play().catch(() => null)}
      onMouseLeave={() => videoRef.current?.pause()}
      data-cursor="view case"
      className={cn(
        "group relative overflow-hidden border border-raw/10 bg-ink",
        className,
      )}
    >
      <Image
        src={campaign.coverMediaUrl}
        alt={campaign.title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
      />
      {campaign.previewVideoUrl ? (
        <video
          ref={videoRef}
          src={campaign.previewVideoUrl}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="mono text-raw/45">{campaign.category}</span>
        <h4 className="font-display mt-1 text-lg text-raw uppercase">{campaign.title}</h4>
        <p className="mono mt-1 text-raw/40">{campaign.clientBrand}</p>
        <p className="mt-3 max-h-0 overflow-hidden text-sm text-raw/60 transition-all duration-500 group-hover:max-h-24">
          {campaign.summary}
        </p>
      </div>
    </article>
  );
}
