"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "@/components/animations/gsap-context";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealText from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

export default function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const isTouch = useRef(false);

  useGSAP(
    () => {
      isTouch.current = window.matchMedia("(hover: none), (pointer: coarse)").matches;

      const cards = railRef.current?.children ? Array.from(railRef.current.children) : [];
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE.out,
          stagger: 0.08,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="work" ref={sectionRef} className="relative bg-[var(--color-paper)] px-5 py-24 md:px-10 md:py-32">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <SectionLabel index="01" label="Selected Work" className="mb-4" />
          <RevealText as="h2" className="block font-display text-4xl leading-tight md:text-6xl">
            Recent projects,
          </RevealText>
          <RevealText as="h2" className="block font-display text-4xl leading-tight md:text-6xl">
            hand-picked.
          </RevealText>
        </div>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/40 md:block">
          {String(projects.length).padStart(2, "0")} projects — 2024–2026
        </span>
      </div>

      <div
        ref={railRef}
        className="flex h-[70vh] min-h-[420px] w-full gap-2 overflow-x-auto md:h-[560px] md:gap-3 md:overflow-visible"
      >
        {projects.map((project) => {
          const isActive = active === project.id;
          const isDimmed = active !== null && !isActive;
          return (
            <button
              key={project.id}
              onMouseEnter={() => !isTouch.current && setActive(project.id)}
              onMouseLeave={() => !isTouch.current && setActive(null)}
              onClick={() => setActive(isActive ? null : project.id)}
              data-cursor={isActive ? "View ↗" : undefined}
              aria-label={`View project: ${project.title}`}
              className={cn(
                "group relative h-full shrink-0 overflow-hidden rounded-none border border-[var(--color-ink)]/10 text-left transition-[flex-grow,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "w-[78vw] md:w-auto",
                isActive ? "md:grow-[6]" : "md:grow-[1]",
                isDimmed ? "opacity-50" : "opacity-100"
              )}
              style={{ flexBasis: 0 }}
            >
              <img
                src={project.image}
                alt={`${project.title} — ${project.category}`}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? "scale-105" : "scale-100"
                )}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />

              {/* Always-visible index, rotated on the collapsed rail */}
              <div
                className={cn(
                  "absolute left-4 top-4 font-display text-sm text-white/80 transition-opacity",
                  isActive ? "opacity-100" : "opacity-90"
                )}
              >
                {project.index}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <div
                  className={cn(
                    "hidden text-white transition-all duration-500 md:block",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {project.category} — {project.date}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl">{project.title}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/90">
                    View Project <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Vertical label shown only while collapsed on desktop */}
                <div
                  className={cn(
                    "hidden text-white/90 transition-opacity duration-300 md:block",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                >
                  <span className="block origin-bottom-left -rotate-90 whitespace-nowrap text-xs uppercase tracking-[0.2em]">
                    {project.title}
                  </span>
                </div>

                {/* Mobile always shows title/category since there's no hover state */}
                <div className="text-white md:hidden">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {project.category} — {project.date}
                  </p>
                  <h3 className="font-display text-xl">{project.title}</h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
