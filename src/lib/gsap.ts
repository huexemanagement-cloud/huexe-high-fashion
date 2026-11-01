"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useLayoutEffect, useEffect } from "react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  gsap.defaults({ ease: "power3.out" });
  registered = true;
}

registerGsap();

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Splits an element's text into masked lines and returns the inner line targets. */
export function splitLines(el: HTMLElement) {
  const split = new SplitText(el, {
    type: "lines",
    linesClass: "huexe-line",
  });
  split.lines.forEach((line) => {
    const wrapper = document.createElement("span");
    wrapper.style.display = "block";
    wrapper.style.overflow = "hidden";
    line.parentNode?.insertBefore(wrapper, line);
    wrapper.appendChild(line);
    (line as HTMLElement).style.display = "block";
    (line as HTMLElement).style.willChange = "transform";
  });
  return split;
}

export { gsap, ScrollTrigger, Flip, SplitText };
