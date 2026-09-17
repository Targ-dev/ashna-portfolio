"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, prefersReducedMotion } from "@/components/animations/gsap-context";
import SectionLabel from "@/components/ui/SectionLabel";

const DISCIPLINES = ["GRAPHIC DESIGN", "BRANDING", "UI DESIGN", "PACKAGING", "MOTION", "AI CREATIVE"];
const TOTAL_FRAMES = 300;

const getFrameSrc = (index: number) => {
  const padded = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${padded}.webp`;
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentFrameRef.current = index;

    if (progressBarRef.current) {
      const pct = ((index + 1) / TOTAL_FRAMES) * 100;
      progressBarRef.current.style.width = `${pct}%`;
    }

    // Pick target image or fallback to nearest loaded frame
    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = index - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img || !img.complete) {
        for (let i = index + 1; i < TOTAL_FRAMES; i++) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    // Cover drawing calculation
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Preload frame image sequence
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      setFirstFrameLoaded(true);
      renderFrame(0);
    };

    let isCancelled = false;

    const loadRest = () => {
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (isCancelled) break;
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = () => {
          images[i] = img;
        };
      }
    };

    const timer = setTimeout(loadRest, 100);

    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [renderFrame]);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const content = contentRef.current;
      const videoWrap = videoWrapRef.current;
      if (!content || !videoWrap) return;

      if (reduced) {
        gsap.set(content, { opacity: 1, y: 0 });
        gsap.set(videoWrap, { yPercent: 0, opacity: 0.001, pointerEvents: "none" });
        return;
      }

      gsap.set(content, { opacity: 0, y: 120 });
      gsap.set(videoWrap, { yPercent: 100 });

      // Phase weighting: content rise (30%) -> hold (15%) -> showreel cover (25%)
      // -> frame sequence scrub playback (60%).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(content, { opacity: 1, y: 0, duration: 0.35, ease: EASE.out })
        .to({}, { duration: 0.2 }) // reading pause
        .to(videoWrap, { yPercent: 0, duration: 0.3, ease: EASE.inOut }, ">");

      const frameProxy = { frame: 0 };
      tl.to(
        frameProxy,
        {
          frame: TOTAL_FRAMES - 1,
          duration: 1.1,
          ease: "none",
          onUpdate: () => {
            renderFrame(Math.round(frameProxy.frame));
          },
        },
        ">"
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [renderFrame] }
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
          <canvas
            ref={canvasRef}
            className="h-full w-full block object-cover"
            style={{ opacity: firstFrameLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
          />

          {/* Fallback frame while canvas initializes */}
          {!firstFrameLoaded && (
            <img
              src="/frames/ezgif-frame-001.webp"
              alt="Showreel preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Showreel overlay with animated indicator & progress */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between p-6 text-xs uppercase tracking-[0.2em] text-white/80 bg-gradient-to-t from-black/85 via-black/35 to-transparent md:p-10">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span>Showreel — Selected Motion Work</span>
            </div>
            <span className="text-white/60">Scroll to scrub</span>
          </div>

          {/* Scrub progress bar line */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-0.5 bg-white/10">
            <div
              ref={progressBarRef}
              className="h-full w-0 bg-[var(--color-accent)] transition-[width] duration-75 ease-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
