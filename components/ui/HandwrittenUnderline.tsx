"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "@/components/animations/gsap-context";
import { cn } from "@/lib/utils";

interface HandwrittenUnderlineProps {
  className?: string;
  color?: string;
}

/** A loose, hand-drawn underline stroke that draws itself in on scroll. */
export default function HandwrittenUnderline({ className, color = "var(--color-accent)" }: HandwrittenUnderlineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      ScrollTrigger.create({
        trigger: svgRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(path, { strokeDashoffset: 0, duration: 0.9, ease: EASE.inOut });
        },
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 24"
      className={cn("block h-4 w-full", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M2 16 C 60 6, 120 22, 180 10 S 260 4, 298 14"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
