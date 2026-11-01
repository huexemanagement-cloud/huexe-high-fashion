"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Magnetic cursor. Any element can declare:
 *  data-cursor="view book" -> morphs the ring into a label pill
 *  data-cursor-variant="dot" | "ring" | "hide"
 *  data-magnetic -> element is pulled toward the pointer
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.documentElement.classList.add("cursor-none-desktop");
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const label = labelRef.current!;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    let visible = false;
    const magnets = new Map<HTMLElement, { x: number; y: number }>();

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      }
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(rect.width, rect.height) * 0.9 + 40;
        if (dist < radius) {
          const pull = 0.32;
          const next = { x: dx * pull, y: dy * pull };
          magnets.set(el, next);
          gsap.to(el, { x: next.x, y: next.y, duration: 0.5, ease: "power3.out" });
        } else if (magnets.has(el)) {
          magnets.delete(el);
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        }
      });
    };

    const applyState = (target: HTMLElement | null) => {
      const node = target?.closest<HTMLElement>("[data-cursor], a, button");
      const text = node?.dataset.cursor;
      const variant = node?.dataset.cursorVariant;

      if (text) {
        label.textContent = `[ ${text} ]`;
        gsap.to(ring, {
          width: label.offsetWidth + 44,
          height: 44,
          borderRadius: 999,
          backgroundColor: "rgba(245,245,243,1)",
          borderColor: "rgba(245,245,243,1)",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.05 });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (variant === "hide") {
        gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
      } else if (node) {
        gsap.to(label, { opacity: 0, duration: 0.15 });
        gsap.to(ring, {
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: "rgba(245,245,243,0.08)",
          borderColor: "rgba(245,245,243,0.6)",
          duration: 0.35,
        });
        gsap.to(dot, { opacity: 1, scale: 0.4, duration: 0.25 });
      } else {
        gsap.to(label, { opacity: 0, duration: 0.15 });
        gsap.to(ring, {
          width: 34,
          height: 34,
          borderRadius: 999,
          backgroundColor: "rgba(245,245,243,0)",
          borderColor: "rgba(245,245,243,0.45)",
          duration: 0.35,
        });
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.25 });
      }
    };

    const onOver = (event: PointerEvent) => applyState(event.target as HTMLElement);
    const onLeave = () => {
      visible = false;
      gsap.to([ring, dot], { opacity: 0, duration: 0.25 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-raw/45 mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="mono pointer-events-none whitespace-nowrap text-[0.6rem] font-medium text-obsidian opacity-0"
        />
      </div>
      <div ref={dotRef} className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-raw mix-blend-difference" />
    </div>
  );
}
