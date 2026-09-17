"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

/**
 * Registers GSAP plugins exactly once, and applies a couple of sane
 * global defaults so every section shares the same motion language.
 */
export function registerGsap() {
  if (registered) return;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);

    gsap.defaults({
      ease: "power3.out",
      duration: 1,
    });

    registered = true;
  }
}

// Auto-register immediately on client load so any component using ScrollTrigger
// or useGSAP has plugins registered before layout effects fire.
if (typeof window !== "undefined") {
  registerGsap();
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

export const EASE = {
  out: "power3.out",
  outStrong: "power4.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  linear: "none",
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
