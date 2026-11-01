"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, splitLines, useIsoLayoutEffect } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** wait for the preloader intro event before playing */
  intro?: boolean;
};

/** Masked, line-by-line editorial reveal driven by GSAP SplitText + ScrollTrigger. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.08,
  intro = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const split = splitLines(el);
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(el, { autoAlpha: 1 });

      const play = () =>
        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          ease: "expo.out",
          stagger,
          delay,
        });

      if (intro) {
        if (document.documentElement.dataset.preloaded === "true") {
          play();
        } else {
          window.addEventListener("huexe:intro", () => play(), { once: true });
        }
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: play,
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}

/** Simple fade + rise for non-text blocks. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
