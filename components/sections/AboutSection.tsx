"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, prefersReducedMotion } from "@/components/animations/gsap-context";
import SectionLabel from "@/components/ui/SectionLabel";

const DISCIPLINES = ["GRAPHIC DESIGN", "BRANDING", "UI DESIGN", "PACKAGING", "MOTION", "AI CREATIVE"];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 1) {
      setVideoReady(true);
    }
    const handleReady = () => setVideoReady(true);
    const handleError = () => setVideoFailed(true);
    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("error", handleError);
    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("error", handleError);
    };
  }, []);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const content = contentRef.current;
      const videoWrap = videoWrapRef.current;
      const video = videoRef.current;
      if (!content || !videoWrap) return;

      if (reduced) {
        // Static, fully legible fallback — no pinning, no scrubbing.
        gsap.set(content, { opacity: 1, y: 0 });
        gsap.set(videoWrap, { yPercent: 0, opacity: 0.001, pointerEvents: "none" });
        return;
      }

      gsap.set(content, { opacity: 0, y: 120 });
      gsap.set(videoWrap, { yPercent: 100 });

      const hasVideo = !videoFailed;

      // Phase weighting: content rise (30%) -> hold (15%) -> video cover (25%)
      // -> video scrub playback (30%). Total pin distance scales with viewport.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=350%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(content, { opacity: 1, y: 0, duration: 0.3, ease: EASE.out })
        .to({}, { duration: 0.15 }) // holding / reading phase
        .to(videoWrap, { yPercent: 0, duration: 0.25, ease: EASE.inOut }, ">");

      if (hasVideo && video) {
        const videoProxy = { t: 0 };
        tl.to(
          videoProxy,
          {
            t: 1,
            duration: 0.3,
            ease: "none",
            onUpdate: () => {
              if (video.duration && isFinite(video.duration)) {
                try {
                  video.currentTime = Math.max(0, Math.min(video.duration - 0.05, videoProxy.t * video.duration));
                } catch {
                  // Ignore seek abort error during fast scrub
                }
              }
            },
          },
          ">"
        );
      } else {
        tl.to({}, { duration: 0.3 });
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [videoFailed] }
  );

  return (
    <section id="about" ref={sectionRef} className="relative bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <div ref={contentRef} className="relative z-10 flex h-full flex-col justify-center px-5 py-20 md:px-10">
          <SectionLabel index="02" label="About Me" dark className="mb-8" />

          <div className="grid gap-10 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7">
              <p className="font-display text-2xl leading-snug md:text-4xl">
                I&apos;m Ashna Alex, a multidisciplinary Creative Designer with
                4+ years of experience across graphic design, branding, UI
                design, packaging, motion graphics, video editing, and
                AI-assisted creative production.
              </p>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--color-paper)]/60 md:text-base">
                I enjoy turning ideas into strong visual experiences — from
                the first concept and creative direction to the final design,
                animation, or video.
              </p>
            </div>

            <div className="flex gap-10 md:col-span-5 md:justify-end">
              <div>
                <span className="font-display text-4xl md:text-6xl">04+</span>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-paper)]/50 md:text-xs">
                  Years Experience
                </p>
              </div>
              <div>
                <span className="font-display text-4xl md:text-6xl">20+</span>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-paper)]/50 md:text-xs">
                  Brands
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--color-paper)]/15 pt-8 md:mt-16">
            {DISCIPLINES.map((d) => (
              <span key={d} className="text-xs uppercase tracking-[0.2em] text-[var(--color-paper)]/50 md:text-sm">
                {d}
              </span>
            ))}
          </div>

          <p className="mt-10 max-w-md text-sm leading-relaxed text-[var(--color-paper)]/60 md:mt-14">
            I&apos;m not limited to one design category. I focus on
            understanding the idea behind a project and finding the strongest
            visual way to communicate it.
          </p>
        </div>

        <div ref={videoWrapRef} className="absolute inset-0 z-20 bg-black overflow-hidden">
          {!videoFailed ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="auto"
              poster="/images/about-poster.jpg"
              onLoadedMetadata={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            >
              <source src="/video/about.mp4" type="video/mp4" />
              <source src="/about.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/images/about-poster.jpg"
              alt="Showreel preview"
              className="h-full w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between p-6 text-xs uppercase tracking-[0.2em] text-white/80 bg-gradient-to-t from-black/85 via-black/35 to-transparent md:p-10">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span>Showreel — Selected Motion Work</span>
            </div>
            <span className="text-white/60">Scroll to scrub</span>
          </div>
        </div>
      </div>
    </section>
  );
}
