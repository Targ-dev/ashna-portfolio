"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "./gsap-context";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    if (prefersReducedMotion()) {
      // Respect reduced-motion: skip the smooth-scroll layer entirely and
      // let the browser use native scrolling. ScrollTrigger still works.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenisRef.current = lenis;
    // Exposing the instance via context requires it to exist first (client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Let anchor links (navbar, etc.) drive Lenis instead of the browser.
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -8 });
    };
    document.addEventListener("click", handleAnchorClick);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Refresh ScrollTrigger after initial mount and font/DOM settle
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}
