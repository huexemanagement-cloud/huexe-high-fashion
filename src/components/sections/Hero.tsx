"use client";

import { useRef } from "react";
import { useApply } from "@/components/apply/ApplyProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Reveal } from "@/components/motion/Reveal";
import { HeroCanvas } from "./HeroCanvas";
import { SHOWREEL } from "@/lib/media";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

export function Hero() {
  const { openDrawer } = useApply();
  const { scrollTo } = useLenis();
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-media]", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -14,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian pt-32 pb-10"
    >
      <div data-hero-media className="absolute inset-0 -top-[10%] h-[120%]">
        <HeroCanvas sources={[SHOWREEL[0].poster, SHOWREEL[1].poster]} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/80" />
      </div>

      <div data-hero-copy className="edge-x relative z-10 w-full">
        <Reveal intro className="mono mb-8 text-raw/50" delay={0.1}>
          <span>SOUTH INDIA // GLOBAL CAPITALS — MOTHER AGENCY &amp; STUDIO</span>
        </Reveal>

        <Reveal intro as="h1" className="display-huge max-w-5xl text-raw" delay={0.2} stagger={0.1}>
          Defining presence. Built for the global board.
        </Reveal>

        <div className="mt-12 grid gap-10 border-t border-raw/15 pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <Reveal intro className="max-w-xl text-lg leading-relaxed text-raw/65 md:text-xl" delay={0.5}>
            <p>
              “Curated individuality. Cast directly across Paris, Milan, and New York.”
            </p>
          </Reveal>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <button
              onClick={() => {
                const el = document.getElementById("roster");
                if (el) scrollTo(el, -10);
              }}
              data-cursor="view roster"
              className="mono bg-raw px-8 py-4 text-obsidian transition-colors hover:bg-accent hover:text-raw"
            >
              Explore Roster
            </button>
            <button
              onClick={openDrawer}
              data-cursor="apply"
              className="mono border border-raw/30 px-8 py-4 text-raw transition-colors hover:border-raw hover:bg-raw/10"
            >
              Submit Digitals
            </button>
          </div>
        </div>

        <div className="mono mt-10 flex flex-wrap items-center justify-between gap-6 text-raw/35">
          <span>Editorial &amp; Runway Board · Direct Placement</span>
          <span className="hidden md:inline">Scroll to enter ↓</span>
          <span>Paris · Milan · Chennai · Dubai · NYC</span>
        </div>
      </div>

      {/* floating showreel chip */}
      <div className="absolute top-[22vh] right-[var(--edge)] z-10 hidden w-[230px] lg:block">
        <div
          data-cursor="play reel"
          onMouseEnter={(event) => {
            const video = event.currentTarget.querySelector("video");
            video?.play().catch(() => null);
          }}
          onMouseLeave={(event) => event.currentTarget.querySelector("video")?.pause()}
          className="relative aspect-[3/4] overflow-hidden border border-raw/15"
        >
          <video
            src={SHOWREEL[0].video}
            poster={SHOWREEL[0].poster}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover opacity-70"
          />
          <span className="mono absolute bottom-3 left-3 text-raw/70">Showreel / SS26</span>
        </div>
      </div>
    </section>
  );
}
