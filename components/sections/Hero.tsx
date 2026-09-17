"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "@/components/animations/gsap-context";
import { SplitText } from "gsap/SplitText";
import HandwrittenUnderline from "@/components/ui/HandwrittenUnderline";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const metaBottomRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(headlineRef.current, {
        type: "lines",
        linesClass: "split-line",
      });

      gsap.set(split.lines, { yPercent: 110, rotate: 1 });
      gsap.set([subRef.current, metaTopRef.current, metaBottomRef.current, frameRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(scrollCueRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: EASE.outStrong } });
      tl.to(split.lines, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.12 })
        .to(metaTopRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
        .to(frameRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
        .to(metaBottomRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, "-=0.3");

      // Scroll-driven: headline & frame move at different speeds and the
      // whole hero dissolves as Work scrolls over it (parallax handoff).
      gsap.to(headlineRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(frameRef.current, {
        yPercent: -60,
        scale: 0.92,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        [subRef.current, metaTopRef.current, metaBottomRef.current, scrollCueRef.current],
        { opacity: 1, yPercent: 0 },
        {
          opacity: 0,
          yPercent: 40,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "60% top", scrub: true },
        }
      );

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--color-paper)] px-5 pb-8 pt-28 md:px-10 md:pt-32"
    >
      <div ref={metaTopRef} className="flex items-start justify-between text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
        <span>Creative Designer &amp; Developer</span>
        <span className="hidden md:inline">Based in Kochi, India — Available 2026</span>
      </div>

      <div className="relative flex flex-1 items-center">
        <h1
          ref={headlineRef}
          className="font-display text-[16vw] font-medium leading-[0.86] tracking-[-0.03em] md:text-[8.4vw]"
        >
          CREATIVE
          <br />
          DESIGNER
          <br />
          + DEVELOPER
        </h1>

        <div
          ref={frameRef}
          className="pointer-events-none absolute right-0 top-1/2 hidden h-64 w-48 -translate-y-1/2 overflow-hidden border border-[var(--color-ink)]/15 md:block lg:h-80 lg:w-60"
        >
          <img
            src="/images/project-05.svg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p ref={subRef} className="max-w-sm text-base leading-relaxed text-[var(--color-ink)]/70 md:text-lg">
          Building visual identities, digital experiences and motion-led
          interfaces
          <span className="relative ml-2 inline-block w-14 align-middle">
            <HandwrittenUnderline />
          </span>
        </p>

        <div ref={metaBottomRef} className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
          <span>04+ Yrs</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>20+ Brands</span>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink)]/40">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-[var(--color-ink)]/30" />
      </div>
    </section>
  );
}
