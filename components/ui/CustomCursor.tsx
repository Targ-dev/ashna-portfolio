"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/animations/gsap-context";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Capability detection requires the DOM and can only run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isFinePointer);
    if (isFinePointer) document.body.classList.add("has-custom-cursor");
    return () => document.body.classList.remove("has-custom-cursor");
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });

      const handleMove = (e: PointerEvent) => {
        ringX(e.clientX);
        ringY(e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);
      };

      const handleOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
        if (target) {
          setExpanded(true);
          setLabel(target.getAttribute("data-cursor") || "");
        }
      };

      const handleOut = (e: PointerEvent) => {
        const related = (e.relatedTarget as HTMLElement) || null;
        if (!related || !related.closest("[data-cursor]")) {
          setExpanded(false);
          setLabel("");
        }
      };

      window.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerover", handleOver);
      document.addEventListener("pointerout", handleOut);

      return () => {
        window.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerover", handleOver);
        document.removeEventListener("pointerout", handleOut);
      };
    },
    { dependencies: [enabled] }
  );

  useGSAP(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      scale: expanded ? 2.6 : 1,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [expanded]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] mix-blend-difference" aria-hidden="true">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-paper)]"
      >
        <span
          ref={labelRef}
          className="font-display text-[8px] uppercase tracking-[0.15em] text-[var(--color-paper)] opacity-0 transition-opacity duration-200"
          style={{ opacity: expanded && label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-paper)]"
      />
    </div>
  );
}
