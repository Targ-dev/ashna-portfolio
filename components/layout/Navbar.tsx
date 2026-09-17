"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "@/components/animations/gsap-context";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(navRef.current, { yPercent: -100 });
    gsap.to(navRef.current, { yPercent: 0, duration: 1, delay: 0.2, ease: EASE.outStrong });

    let show = true;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = window.scrollY;
        setSolid(y > 40);

        const goingDown = self.direction === 1;
        if (goingDown && y > 160 && show) {
          show = false;
          gsap.to(navRef.current, { yPercent: -100, duration: 0.5, ease: EASE.inOut });
        } else if (!goingDown && !show) {
          show = true;
          gsap.to(navRef.current, { yPercent: 0, duration: 0.5, ease: EASE.inOut });
        }
      },
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
  }, [menuOpen]);

  useGSAP(
    () => {
      const el = menuRef.current;
      if (!el) return;
      if (menuOpen) {
        gsap.set(el, { display: "flex" });
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: EASE.inOut });
        gsap.fromTo(
          el.querySelectorAll("[data-menu-link]"),
          { yPercent: 120 },
          { yPercent: 0, duration: 0.7, ease: EASE.outStrong, stagger: 0.06, delay: 0.15 }
        );
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: EASE.inOut,
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 transition-colors duration-500 md:px-10 md:py-6",
          solid ? "bg-[var(--color-paper)]/85 backdrop-blur-sm" : "bg-transparent"
        )}
      >
        <a href="#top" className="font-display text-sm font-medium tracking-tight" data-cursor="home">
          Ashna&nbsp;Alex
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/70 transition-colors hover:text-[var(--color-ink)]"
              data-cursor="view"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em]"
            data-cursor="go"
          >
            Say hello
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="z-50 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-center gap-6 bg-[var(--color-ink)] px-8 md:hidden"
        style={{ display: "none" }}
      >
        {LINKS.map((link) => (
          <div key={link.href} className="overflow-hidden">
            <a
              data-menu-link
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block font-display text-4xl text-[var(--color-paper)]"
            >
              {link.label}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
