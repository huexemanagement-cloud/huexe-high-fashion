"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ModelStats } from "@/db/schema";

type Props = {
  name: string;
  category: string;
  location: string | null;
  instagram: string | null;
  stats: ModelStats;
  images: string[];
};

export function CompCard({ name, category, location, instagram, stats, images }: Props) {
  useEffect(() => {
    document.title = `HUEXE Comp Card — ${name}`;
  }, [name]);

  const specs: Array<[string, string | undefined]> = [
    ["Height", stats.height],
    ["Bust / Chest", stats.bust ?? stats.chest],
    ["Waist", stats.waist],
    ["Hips", stats.hips],
    ["Shoe", stats.shoe],
    ["Hair", stats.hair],
    ["Eyes", stats.eyes],
  ];

  return (
    <div className="min-h-screen bg-[#2a2a2a] py-10 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-8 flex max-w-[860px] items-center justify-between px-4">
        <Link href={`/talent/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="mono text-raw/60 hover:text-raw">
          ← Back to profile
        </Link>
        <button
          onClick={() => window.print()}
          className="mono bg-raw px-6 py-3 text-obsidian transition hover:bg-accent hover:text-raw"
        >
          Download / print PDF
        </button>
      </div>

      <article
        className="mx-auto flex aspect-[210/297] w-[860px] max-w-[94vw] flex-col bg-white p-10 text-[#0A0A0A] print:w-full print:max-w-none print:p-8"
        style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}
      >
        <header className="flex items-start justify-between border-b border-black/15 pb-5">
          <div>
            <h1 className="font-display text-4xl leading-none font-extrabold tracking-tight uppercase">
              {name}
            </h1>
            <p className="mono mt-2 text-black/50">
              {category} board — {location ?? "Location on request"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl leading-none font-extrabold uppercase">Huexe</p>
            <p className="mono mt-1 text-black/45">Mother agency &amp; remote production</p>
          </div>
        </header>

        <div className="mt-6 grid flex-1 grid-cols-3 grid-rows-2 gap-3">
          {images.slice(0, 5).map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${name} ${index + 1}`}
              className={`h-full w-full object-cover ${index === 0 ? "col-span-2 row-span-2" : ""}`}
            />
          ))}
        </div>

        <footer className="mt-6 border-t border-black/15 pt-5">
          <dl className="mono grid grid-cols-4 gap-y-3 text-black/70 md:grid-cols-7">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-black/40">{label}</dt>
                <dd className="mt-1 text-[0.8rem] text-black">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
          <p className="mono mt-5 flex flex-wrap justify-between gap-3 text-black/45">
            <span>bookings@huexe.co</span>
            <span>{instagram ?? "@huexe"}</span>
            <span>South India // Global capitals</span>
          </p>
        </footer>
      </article>
    </div>
  );
}
