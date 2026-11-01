"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitInquiry } from "@/app/actions/public";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { BLUR_DATA_URL } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { ModelStats } from "@/db/schema";

export type TalentData = {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string | null;
  bio: string | null;
  stats: ModelStats;
  featuredImage: string;
  hoverPolaroid: string | null;
  galleryImages: string[];
  polaroidImages: string[];
  instagram: string | null;
};

export function TalentView({ model }: { model: TalentData }) {
  const [tab, setTab] = useState<"book" | "polaroids">("book");
  const [booking, setBooking] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);

  const book = model.galleryImages.length ? model.galleryImages : [model.featuredImage];
  const polaroids = model.polaroidImages.length
    ? model.polaroidImages
    : [model.hoverPolaroid ?? model.featuredImage];
  const images = tab === "book" ? book : polaroids;

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80);
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap.current,
            start: "top top",
            end: () => `+=${distance() + 200}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });
    }, pinWrap);
    return () => ctx.revert();
  }, [tab]);

  const specs: Array<[string, string | undefined]> = [
    ["Height", model.stats.height],
    ["Bust / Chest", model.stats.bust ?? model.stats.chest],
    ["Waist", model.stats.waist],
    ["Hips", model.stats.hips],
    ["Shoe", model.stats.shoe],
    ["Hair", model.stats.hair],
    ["Eyes", model.stats.eyes],
  ];

  return (
    <>
      <section className="edge-x grid gap-12 pt-36 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink">
          <Image
            src={model.featuredImage}
            alt={model.name}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 42vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <Link href="/#roster" className="mono text-raw/40 transition hover:text-raw">
              ← Back to roster
            </Link>
            <Reveal as="h1" className="display-huge mt-6 text-raw">
              {model.name}
            </Reveal>
            <p className="mono mt-5 text-raw/45">
              {model.category} board — {model.location ?? "Location on request"}
              {model.instagram ? ` — ${model.instagram}` : ""}
            </p>
            {model.bio ? (
              <Reveal className="mt-8 max-w-xl text-lg leading-relaxed text-raw/65">
                <p>{model.bio}</p>
              </Reveal>
            ) : null}
          </div>

          <dl className="mono mt-12 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-raw/10 pt-8 md:grid-cols-4">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-raw/30">{label}</dt>
                <dd className="mt-1 text-base text-raw">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => setBooking(true)}
              data-magnetic
              data-cursor="hold"
              className="mono bg-raw px-8 py-4 text-obsidian transition hover:bg-accent hover:text-raw"
            >
              Request booking / hold
            </button>
            <Link
              href={`/talent/${model.slug}/comp-card`}
              data-cursor="comp card"
              className="mono border border-raw/25 px-8 py-4 text-raw transition hover:border-raw"
            >
              Generate PDF comp card
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-raw/10 py-10">
        <div className="edge-x flex flex-wrap items-center gap-3">
          {(["book", "polaroids"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={cn(
                "mono border px-5 py-2.5 transition",
                tab === item
                  ? "border-raw bg-raw text-obsidian"
                  : "border-raw/20 text-raw/50 hover:border-raw/60 hover:text-raw",
              )}
            >
              {item === "book" ? "Lookbook" : "Polaroids / Digitals"}
            </button>
          ))}
          <span className="mono ml-auto hidden text-raw/30 md:block">
            Scroll to pan the book →
          </span>
        </div>
      </section>

      <section ref={pinWrap} className="relative overflow-hidden">
        <div ref={track} className="flex w-max gap-5 px-[var(--edge)] pb-20 max-[899px]:w-full max-[899px]:flex-col">
          {images.map((src, index) => (
            <figure
              key={`${tab}-${src}-${index}`}
              data-cursor-variant="ring"
              className="relative h-[62vh] w-[min(86vw,520px)] shrink-0 overflow-hidden bg-ink max-[899px]:h-[70vh] max-[899px]:w-full"
            >
              <Image
                src={src}
                alt={`${model.name} ${tab} ${index + 1}`}
                fill
                sizes="(max-width: 900px) 92vw, 40vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
              <figcaption className="mono absolute bottom-3 left-3 bg-obsidian/60 px-2 py-1 text-raw/70 backdrop-blur-sm">
                {tab === "book" ? "LOOK" : "DIGITAL"} {String(index + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {booking ? (
          <BookingModal model={model} onClose={() => setBooking(false)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function BookingModal({ model, onClose }: { model: TalentData; onClose: () => void }) {
  const [state, setState] = useState({
    companyName: "",
    contactName: "",
    email: "",
    serviceType: "Talent Booking",
    projectBrief: "",
  });
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    const res = await submitInquiry({ ...state, requestedModels: [model.id] });
    setResult(res);
    setSending(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className="relative w-full max-w-xl border border-raw/15 bg-ink p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="mono text-raw/40">B2B hold request</p>
            <h3 className="display-lg mt-2 text-raw">{model.name}</h3>
          </div>
          <button onClick={onClose} className="mono text-raw/50 hover:text-raw">
            Close
          </button>
        </div>

        {result?.ok ? (
          <p className="mt-8 text-raw/70">{result.message}</p>
        ) : (
          <div className="mt-8 space-y-5">
            <Input label="Company / brand *" value={state.companyName} onChange={(v) => setState((s) => ({ ...s, companyName: v }))} />
            <Input label="Contact name" value={state.contactName} onChange={(v) => setState((s) => ({ ...s, contactName: v }))} />
            <Input label="Email *" value={state.email} onChange={(v) => setState((s) => ({ ...s, email: v }))} />
            <label className="block">
              <span className="mono text-raw/40">Service</span>
              <select
                value={state.serviceType}
                onChange={(e) => setState((s) => ({ ...s, serviceType: e.target.value }))}
                className="mt-2 w-full border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
              >
                {["Talent Booking", "Event Casting", "Turnkey Remote Production"].map((option) => (
                  <option key={option} value={option} className="bg-ink">
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mono text-raw/40">Project brief / dates</span>
              <textarea
                rows={3}
                value={state.projectBrief}
                onChange={(e) => setState((s) => ({ ...s, projectBrief: e.target.value }))}
                className="mt-2 w-full resize-none border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
              />
            </label>
            {result && !result.ok ? <p className="mono text-accent">{result.message}</p> : null}
            <button
              onClick={send}
              disabled={sending}
              className="mono w-full bg-raw py-4 text-obsidian transition hover:bg-accent hover:text-raw disabled:opacity-40"
            >
              {sending ? "Sending…" : "Place hold request"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
      />
    </label>
  );
}
