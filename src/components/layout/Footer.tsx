"use client";

import Link from "next/link";
import { useApply } from "@/components/apply/ApplyProvider";

export type FooterSocials = {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
};

export function Footer({ socials }: { socials?: FooterSocials }) {
  const { openDrawer } = useApply();
  const year = new Date().getFullYear();

  const socialList = [
    { label: "Instagram", url: socials?.instagram },
    { label: "X / Twitter", url: socials?.twitter },
    { label: "LinkedIn", url: socials?.linkedin },
    { label: "TikTok", url: socials?.tiktok },
    { label: "YouTube", url: socials?.youtube },
  ].filter((s) => Boolean(s.url));

  // Fallback if none configured
  const activeSocials =
    socialList.length > 0
      ? socialList
      : [{ label: "Instagram", url: "https://instagram.com/huexe" }];

  return (
    <footer className="grain relative overflow-hidden border-t border-raw/10 bg-obsidian pt-24 pb-10">
      <div className="edge-x">
        <div className="grid gap-12 border-b border-raw/10 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="mono text-raw/35">Mother agency &amp; remote production</p>
            <h2 className="display-xl mt-5 text-raw">
              Let&apos;s build
              <br />
              something
              <br />
              <span className="font-editorial text-accent lowercase italic">permanent.</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={openDrawer}
                data-magnetic
                data-cursor="apply"
                className="mono bg-raw px-7 py-3.5 text-obsidian transition hover:bg-accent hover:text-raw"
              >
                Submit your digitals
              </button>
              <a
                href="mailto:bookings@huexe.co"
                data-magnetic
                data-cursor="email"
                className="mono border border-raw/25 px-7 py-3.5 text-raw transition hover:border-raw"
              >
                bookings@huexe.co
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="mono text-raw/35">Navigate</p>
            {[
              { label: "The Agency", href: "/#about" },
              { label: "Curated Roster", href: "/#roster" },
              { label: "Productions", href: "/#services" },
              { label: "Submit Digitals", href: "/#apply" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-raw/55 transition hover:text-raw"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <p className="mono text-raw/35">Network // Social</p>
            <div className="space-y-2.5">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-raw/55 transition hover:text-raw"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="mono text-raw/35">Studios</p>
            <p className="text-raw/55">
              Chennai — Bengaluru — Kochi
              <br />
              South India // 13.08°N 80.27°E
            </p>
            <p className="text-raw/55">
              Representation desks:
              <br />
              Paris · Milan · Dubai · Seoul · New York
            </p>
          </div>
        </div>

        <div className="mono flex flex-col gap-4 pt-8 text-raw/30 md:flex-row md:items-center md:justify-between">
          <span>© {year} Huexe Agency — All rights reserved</span>
          <span>Individuality over perfection · Presence over symmetry</span>
          <span>Built for the 2026 season</span>
        </div>
      </div>

      <div className="pointer-events-none mt-16 overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="display-huge pr-10 whitespace-nowrap text-raw/[0.06]"
            >
              HUEXE — HUEXE — HUEXE — HUEXE —&nbsp;
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
