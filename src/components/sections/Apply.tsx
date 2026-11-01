"use client";

import { useRef } from "react";
import { useApply } from "@/components/apply/ApplyProvider";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

const REQUIREMENTS = [
  ["01", "Full-length front", "Natural light, fitted clothing, no shoes."],
  ["02", "Full-length profile", "Side-on, arms relaxed, straight posture."],
  ["03", "Close-up, no makeup", "Hair back, neutral expression, no filter."],
  ["04", "360 walk video", "Slow turn, 15 seconds, phone held vertical."],
];

export function Apply() {
  const { openDrawer } = useApply();
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-apply-marquee]", {
        xPercent: -28,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="apply"
      ref={root}
      className="grain relative overflow-hidden border-t border-raw/10 bg-raw py-28 text-obsidian"
    >
      <div
        data-apply-marquee
        className="font-display pointer-events-none absolute top-10 left-0 text-[clamp(6rem,17vw,16rem)] leading-none font-extrabold whitespace-nowrap text-obsidian/[0.05] uppercase"
      >
        Be seen — be represented — be seen — be represented
      </div>

      <div className="edge-x relative grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mono text-[11px] tracking-[0.26em] text-obsidian/45 uppercase">
            Digital Scouting // Join the Board
          </p>
          <Reveal as="h2" className="display-huge mt-6 text-obsidian">
            Be seen.
            <br />
            Be represented.
          </Reveal>
          <Reveal className="mt-10 max-w-xl text-lg leading-relaxed text-obsidian/75">
            <p>
              Open board. Natural light and unedited digitals only. We review prospective talent weekly across runway, editorial, and commercial boards.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={openDrawer}
              className="font-sans text-xs tracking-[0.2em] font-semibold uppercase bg-obsidian px-10 py-5 text-raw transition-all duration-300 hover:bg-accent"
            >
              Submit Digitals
            </button>
            <span className="mono text-xs text-obsidian/55">
              Open Board · Submissions Reviewed Weekly
            </span>
          </div>
        </div>

        <div className="border-t border-obsidian/15 pt-8">
          <p className="mono text-obsidian/40">What we need from you</p>
          <ul className="mt-6 divide-y divide-obsidian/10">
            {REQUIREMENTS.map(([index, title, detail]) => (
              <li key={index} className="group flex gap-6 py-5">
                <span className="mono text-obsidian/35">{index}</span>
                <div>
                  <h3 className="font-display text-lg text-obsidian uppercase">{title}</h3>
                  <p className="mono mt-1 leading-relaxed text-obsidian/45">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mono mt-8 leading-relaxed text-obsidian/40">
            Uploads are stored in a private bucket. Only the Huexe scouting desk can view your
            digitals.
          </p>
        </div>
      </div>
    </section>
  );
}
