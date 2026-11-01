"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Flip, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { BLUR_DATA_URL } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { ModelStats } from "@/db/schema";

export type RosterModel = {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string | null;
  featuredImage: string;
  hoverPolaroid: string | null;
  stats: ModelStats;
  isFeatured: boolean;
};

const FILTERS = ["All", "Runway", "Editorial", "Commercial", "New Faces"] as const;

export function Roster({ models }: { models: RosterModel[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const first = useRef(true);

  useIsoLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.75,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      stagger: 0.03,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.55, stagger: 0.03 },
        ),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.92, duration: 0.3 }),
    });
    flipState.current = null;
  }, [filter]);

  const changeFilter = (next: (typeof FILTERS)[number]) => {
    if (next === filter || !gridRef.current) return;
    flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-card]"), {
      props: "opacity",
    });
    setFilter(next);
  };

  const counts = FILTERS.reduce<Record<string, number>>((acc, key) => {
    acc[key] = key === "All" ? models.length : models.filter((m) => m.category === key).length;
    return acc;
  }, {});

  return (
    <section id="roster" className="relative border-t border-raw/10 bg-obsidian py-28">
      <div className="edge-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="mono text-[11px] tracking-[0.26em] text-raw/40 uppercase">
              Curated Board // Roster
            </p>
            <Reveal as="h2" className="display-xl mt-6 text-raw">
              Faces that
              <br />
              hold the frame.
            </Reveal>
          </div>
          <Reveal className="max-w-lg text-lg leading-relaxed text-raw/60">
            <p>
              A curated showcase of editorial storytelling, high-energy commercial lookbooks, and
              striking new faces defining modern visual culture.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-2 border-y border-raw/10 py-5">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => changeFilter(item)}
              data-cursor-variant="ring"
              className={cn(
                "mono border px-5 py-2.5 transition-colors duration-300",
                filter === item
                  ? "border-raw bg-raw text-obsidian"
                  : "border-raw/20 text-raw/55 hover:border-raw/60 hover:text-raw",
              )}
            >
              {item}
              <sup className="ml-1.5 opacity-50">{counts[item] ?? 0}</sup>
            </button>
          ))}
          <span className="mono ml-auto hidden text-raw/30 md:block">
            Hover a card for digitals &amp; specs
          </span>
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4"
        >
          {models.map((model, index) => {
            const visible = filter === "All" || model.category === filter;
            return (
              <article
                key={model.id}
                data-card
                data-flip-id={model.id}
                className={cn("group", visible ? "block" : "hidden")}
              >
                <Link
                  href={`/talent/${model.slug}`}
                  data-cursor="view book"
                  className="block"
                  prefetch={false}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                    <Image
                      src={model.featuredImage}
                      alt={model.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      priority={index < 4}
                      className="object-cover grayscale transition-all duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:opacity-0"
                    />
                    {model.hoverPolaroid ? (
                      <Image
                        src={model.hoverPolaroid}
                        alt={`${model.name} polaroid`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="scale-[1.06] object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                      />
                    ) : null}

                    {model.isFeatured ? (
                      <span className="mono absolute top-3 left-3 border border-raw/40 bg-obsidian/40 px-2 py-1 text-raw/80 backdrop-blur-sm">
                        Featured
                      </span>
                    ) : null}

                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-obsidian/85 px-3 py-3 backdrop-blur-md transition-transform duration-500 ease-out group-hover:translate-y-0">
                      <dl className="mono-xs grid grid-cols-3 gap-y-2 text-raw/70">
                        <Spec label="HGT" value={model.stats.height} />
                        <Spec label="BUST" value={model.stats.bust ?? model.stats.chest} />
                        <Spec label="WAIST" value={model.stats.waist} />
                        <Spec label="HIPS" value={model.stats.hips} />
                        <Spec label="SHOE" value={model.stats.shoe} />
                        <Spec label="EYES" value={model.stats.eyes} />
                      </dl>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-base tracking-tight text-raw uppercase">
                      {model.name}
                    </h3>
                    <span className="mono text-raw/30">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mono mt-1 text-raw/35">
                    {model.category} — {model.location ?? "On request"}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>

        {models.length === 0 ? (
          <p className="mono mt-16 text-raw/40">
            Roster is being updated. Publish talent from the /admin dashboard.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-raw/35">{label}</dt>
      <dd className="text-raw">{value ?? "—"}</dd>
    </div>
  );
}
