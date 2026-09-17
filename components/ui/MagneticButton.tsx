"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/animations/gsap-context";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  href?: string;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className,
  as: Component = "button",
  href,
  strength = 0.4,
  onClick,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const el = elRef.current;
      if (!wrap || !el) return;
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const handleMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      wrap.addEventListener("pointermove", handleMove);
      wrap.addEventListener("pointerleave", handleLeave);

      return () => {
        wrap.removeEventListener("pointermove", handleMove);
        wrap.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: wrapRef, dependencies: [strength] }
  );

  return (
    <div ref={wrapRef} className="inline-block" data-cursor="view">
      <Component
        ref={elRef as unknown as React.Ref<HTMLElement>}
        href={href}
        onClick={onClick}
        className={cn("inline-block will-change-transform", className)}
      >
        {children}
      </Component>
    </div>
  );
}
