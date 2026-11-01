"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("huexe-preloaded") === "1";
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (sessionStorage.getItem("huexe-preloaded") === "1") {
      document.documentElement.dataset.preloaded = "true";
      window.dispatchEvent(new CustomEvent("huexe:intro"));
      return;
    }

    document.body.style.overflow = "hidden";
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        document.documentElement.dataset.preloaded = "true";
        sessionStorage.setItem("huexe-preloaded", "1");
        setDone(true);
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        if (counterRef.current) {
          counterRef.current.textContent = `${String(v).padStart(2, "0")} — 100%`;
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${counter.value / 100})`;
        }
      },
    })
      .to(
        [counterRef.current, barRef.current?.parentElement ?? null].filter(Boolean),
        { opacity: 0, duration: 0.35 },
        "+=0.1",
      )
      .add(() => window.dispatchEvent(new CustomEvent("huexe:intro")), "-=0.05")
      .to(topRef.current, { yPercent: -101, duration: 1.05, ease: "expo.inOut" }, "shutter")
      .to(bottomRef.current, { yPercent: 101, duration: 1.05, ease: "expo.inOut" }, "shutter");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[9998]" aria-hidden>
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-obsidian" />
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-obsidian" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <span className="display-lg text-raw">HUEXE</span>
        <div className="h-[2px] w-[min(46vw,420px)] overflow-hidden bg-raw/15">
          <span ref={barRef} className="block h-full w-full origin-left scale-x-0 bg-raw" />
        </div>
        <span ref={counterRef} className="mono text-raw/70">
          00 — 100%
        </span>
      </div>
      <div className="mono absolute bottom-8 left-1/2 -translate-x-1/2 text-raw/40">
        Mother agency &amp; remote production studio
      </div>
    </div>
  );
}
