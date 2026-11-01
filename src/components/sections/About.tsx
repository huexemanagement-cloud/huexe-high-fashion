"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { BLUR_DATA_URL, px } from "@/lib/media";

const PLATES = [
  { src: px(2723623, 900, 1200), caption: "Development test — Chennai", span: "w-[84%] ml-auto" },
  { src: px(19222080, 900, 1200), caption: "Studio board — Monochrome series", span: "w-[70%]" },
  { src: px(9509647, 1200, 800), caption: "Runway presentation — Gulf Fashion Week", span: "w-[92%] ml-auto" },
];

export function About() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((plate) => {
        const img = plate.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: plate, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative border-t border-raw/10 bg-obsidian pt-24 pb-32"
    >
      <div className="edge-x grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div data-about-left className="lg:sticky lg:top-28 lg:self-start lg:py-6">
          <p className="mono text-[11px] tracking-[0.26em] text-raw/40 uppercase">
            The Atelier // Heritage
          </p>
          <Reveal as="h2" className="font-display mt-6 text-[clamp(2.0rem,3.8vw,4.0rem)] font-bold leading-[1.08] tracking-tight text-raw">
            A mother agency engineered for international placement.
          </Reveal>
          <div className="mt-8 max-w-md space-y-4 text-sm leading-relaxed text-raw/60 sm:text-base">
            <Reveal>
              <p>
                Headquartered in South India with direct desks in Paris and Milan, HUEXE develops non-standard, architectural faces for global runway and luxury campaigns.
              </p>
            </Reveal>
            <Reveal>
              <p>
                From initial polaroid scouting to direct international agency optioning, we shape talent with uncompromising aesthetic discipline and boutique care.
              </p>
            </Reveal>
          </div>
          <dl className="mono mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-raw/10 pt-8 text-xs text-raw/45">
            {[
              ["Founded", "Mother Agency & Studio"],
              ["Desks", "Chennai · Paris · Milan · NYC"],
              ["Divisions", "Runway · Editorial · Commercial"],
              ["Capability", "Direct Optioning & Remote Shoots"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-raw/30 tracking-wider uppercase">{k}</dt>
                <dd className="mt-1 text-raw/80 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-24 lg:pt-6">
          {PLATES.map((plate, index) => (
            <figure key={plate.src} data-plate className={plate.span}>
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <Image
                  src={plate.src}
                  alt={plate.caption}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
              <figcaption className="mono mt-3 flex items-baseline justify-between text-xs text-raw/40">
                <span>{plate.caption}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}

          <div className="border-t border-raw/10 pt-12">
            <p className="mono text-[11px] tracking-[0.26em] text-raw/40 uppercase">The Philosophy</p>
            <Reveal
              as="blockquote"
              className="font-editorial mt-6 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.1] text-raw italic"
              stagger={0.08}
            >
              &ldquo;Individuality over perfection. Presence over symmetry. We believe raw authenticity is the
              most powerful aesthetic in modern fashion.&rdquo;
            </Reveal>
          </div>

          <div className="border-t border-raw/10 pt-12">
            <p className="mono text-[11px] tracking-[0.26em] text-raw/40 uppercase">Agency History</p>
            <Reveal className="mt-6 max-w-xl text-lg leading-relaxed text-raw/70">
              <p>
                Born from a legacy of independent creative direction, built into a full-service mother
                agency and remote execution studio.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
