"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "@/components/animations/gsap-context";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

interface RevealTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** "lines" masks and slides whole lines up; "chars" staggers individual characters */
  mode?: "lines" | "chars";
  /** Animate on scroll into view (default) or immediately on mount (hero) */
  trigger?: "scroll" | "immediate";
  delay?: number;
  stagger?: number;
}

export default function RevealText({
  children,
  as: Tag = "div",
  className,
  mode = "lines",
  trigger = "scroll",
  delay = 0,
  stagger = 0.06,
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const split = new SplitText(el, {
        type: mode === "lines" ? "lines" : "lines,chars",
        linesClass: "split-line",
        charsClass: "char",
      });

      const targets = mode === "lines" ? split.lines : split.chars;

      gsap.set(targets, { yPercent: 110, opacity: mode === "chars" ? 0 : 1 });

      const anim = () =>
        gsap.to(targets, {
          yPercent: 0,
          opacity: 1,
          duration: mode === "lines" ? 1.1 : 0.7,
          ease: mode === "lines" ? EASE.outStrong : EASE.out,
          stagger: mode === "lines" ? 0.12 : stagger / 8,
          delay,
        });

      if (trigger === "immediate") {
        anim();
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: anim,
          once: true,
        });
      }

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [children, mode, trigger] }
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
