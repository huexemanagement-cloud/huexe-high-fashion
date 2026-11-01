"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

const PANELS = [
  {
    index: "01",
    label: "Singular Scouting",
    copy: "Locating distinctive bone structure and presence outside conventional boundaries. We develop raw faces for the international luxury circuit.",
    meta: ["Scouting", "Development", "Placement"],
  },
  {
    index: "02",
    label: "Direct Placement",
    copy: "Bypassing intermediary barriers to place models directly with premier couture ateliers, fashion weeks, and campaigns worldwide.",
    meta: ["Runway", "Editorial", "Campaigns"],
  },
  {
    index: "03",
    label: "Remote Production",
    copy: "Turnkey visual campaigns executed from South India with European art direction. Complete casting, fitting, lighting, and digital mastering.",
    meta: ["Turnkey", "Execution", "Direction"],
  },
];

export function Narrative() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.to(root.current, {
          backgroundColor: "#0A0A0A",
          color: "#F5F5F3",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() * 0.45}`,
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-panel-index]").forEach((panel) => {
          const num = panel.querySelector("[data-panel-num]");
          if (!num) return;
          gsap.fromTo(
            num,
            { yPercent: 30, opacity: 0.1 },
            {
              yPercent: -10,
              opacity: 0.8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 85%",
                end: "right 20%",
                scrub: true,
              },
            },
          );
        });

        return () => {
          tween.kill();
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.to(root.current, {
          backgroundColor: "#0A0A0A",
          color: "#F5F5F3",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 10%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="narrative"
      ref={root}
      className="relative overflow-hidden bg-raw text-obsidian transition-colors duration-700"
      style={{ backgroundColor: "#F5F5F3", color: "#0A0A0A" }}
    >
      <div
        ref={track}
        className="flex min-h-[100svh] w-max flex-col items-stretch gap-0 py-24 max-[899px]:w-full max-[899px]:gap-20 min-[900px]:flex-row min-[900px]:py-0"
      >
        <div className="flex w-[min(92vw,560px)] shrink-0 flex-col justify-center px-[var(--edge)] max-[899px]:w-full min-[900px]:w-[46vw]">
          <p className="mono text-[11px] tracking-[0.25em] uppercase opacity-50">
            Strategic Vision // Core Pillars
          </p>
          <h2 className="font-display mt-6 text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
            The
            <br />
            position
            <br />
            we take.
          </h2>
          <p className="font-sans mt-8 max-w-xs text-sm leading-relaxed opacity-60">
            Three fixed principles that govern every board we build, every casting we curate and
            every production we execute.
          </p>
        </div>

        {PANELS.map((panel) => (
          <article
            key={panel.index}
            data-panel-index
            className="relative flex w-[min(92vw,720px)] shrink-0 flex-col justify-between border-l border-current/15 px-[var(--edge)] py-16 max-[899px]:w-full max-[899px]:border-l-0 max-[899px]:border-t min-[900px]:w-[52vw] min-[900px]:py-28"
          >
            <div className="flex items-start justify-between">
              <span className="mono text-xs tracking-wider opacity-50">
                {panel.index} / {panel.label.toUpperCase()}
              </span>
              <span className="mono text-xs tracking-widest opacity-35 uppercase">Ethos</span>
            </div>

            <div
              data-panel-num
              className="font-display pointer-events-none text-[clamp(8rem,22vw,20rem)] leading-[0.75] font-extrabold opacity-10"
            >
              {panel.index}
            </div>

            <p className="max-w-2xl text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.18] font-light">
              {panel.copy}
            </p>

            <ul className="mono mt-10 flex flex-wrap gap-2.5">
              {panel.meta.map((tag) => (
                <li key={tag} className="border border-current/25 px-3.5 py-1.5 text-xs opacity-70">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}

        <div className="flex w-[min(92vw,420px)] shrink-0 items-center px-[var(--edge)] max-[899px]:w-full min-[900px]:w-[32vw]">
          <p className="font-editorial text-[clamp(1.6rem,2.8vw,2.6rem)] leading-tight italic opacity-85">
            &ldquo;Raw authenticity is the most powerful aesthetic in modern fashion.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
