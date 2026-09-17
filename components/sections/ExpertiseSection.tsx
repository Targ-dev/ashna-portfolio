"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/animations/gsap-context";
import SectionLabel from "@/components/ui/SectionLabel";

interface Row {
  label: string;
  detail: string;
  speed: number;
  align: "start" | "end";
}

const ROWS: Row[] = [
  { label: "GRAPHIC DESIGN", detail: "Print, editorial & visual systems", speed: 1, align: "start" },
  { label: "BRANDING", detail: "Identity, naming & brand worlds", speed: -1.4, align: "end" },
  { label: "UI / UX", detail: "Product design & design systems", speed: 1.2, align: "start" },
  { label: "PACKAGING", detail: "Structural & retail packaging", speed: -1, align: "end" },
  { label: "MOTION", detail: "Motion graphics & animation", speed: 1.4, align: "start" },
  { label: "AI CREATIVE", detail: "AI-assisted production pipelines", speed: -1.2, align: "end" },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLDivElement>("[data-expertise-row]");

      rows.forEach((row) => {
        const speed = Number(row.dataset.speed);
        const track = row.querySelector("[data-track]");
        if (!track) return;

        gsap.to(track, {
          xPercent: speed * 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="expertise" ref={sectionRef} className="overflow-hidden bg-[var(--color-paper)] px-5 py-24 md:px-10 md:py-32">
      <SectionLabel index="03" label="Expertise" className="mb-14" />

      <div className="flex flex-col divide-y divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
        {ROWS.map((row) => (
          <div
            key={row.label}
            data-expertise-row
            data-speed={row.speed}
            className="group relative flex items-center overflow-hidden py-6 md:py-10"
          >
            <div
              data-track
              className={`flex w-full items-baseline gap-6 whitespace-nowrap will-change-transform ${
                row.align === "end" ? "justify-end text-right" : "justify-start"
              }`}
            >
              <h3 className="font-display text-[13vw] leading-none tracking-tight transition-colors duration-300 group-hover:text-[var(--color-accent)] md:text-[6vw]">
                {row.label}
              </h3>
            </div>
            <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink)]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:bottom-3">
              {row.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
