"use client";

import { ArrowUpRight } from "lucide-react";
import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";

const SOCIALS = [
  { label: "Email", href: "mailto:hello@ashnaalex.com", value: "hello@ashnaalex.com" },
  { label: "LinkedIn", href: "https://linkedin.com", value: "@ashnaalex" },
  { label: "Instagram", href: "https://instagram.com", value: "@ashna.alex" },
  { label: "Behance", href: "https://behance.net", value: "/ashnaalex" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-[var(--color-ink)] px-5 py-24 text-[var(--color-paper)] md:px-10 md:py-32">
      <SectionLabel index="04" label="Contact" dark className="mb-10" />

      <RevealText
        as="h2"
        className="font-display text-[15vw] leading-[0.9] tracking-[-0.02em] md:text-[9vw]"
      >
        LET&apos;S MAKE
      </RevealText>
      <RevealText
        as="h2"
        className="font-display text-[15vw] leading-[0.9] tracking-[-0.02em] text-[var(--color-accent)] md:text-[9vw]"
      >
        SOMETHING.
      </RevealText>

      <div className="mt-14 flex flex-col items-start justify-between gap-10 md:mt-20 md:flex-row md:items-end">
        <ul className="flex flex-col gap-3">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm uppercase tracking-[0.15em] text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)] md:text-base"
                data-cursor="open"
              >
                <span className="w-20 text-[10px] text-[var(--color-paper)]/40 md:text-xs">{s.label}</span>
                {s.value}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>

        <MagneticButton
          as="a"
          href="mailto:hello@ashnaalex.com"
          strength={0.5}
          className="flex h-40 w-40 items-center justify-center rounded-full border border-[var(--color-paper)]/30 text-center font-display text-sm uppercase leading-tight text-[var(--color-paper)] transition-colors hover:border-[var(--color-paper)] md:h-52 md:w-52 md:text-base"
        >
          Start a
          <br />
          Project
        </MagneticButton>
      </div>
    </section>
  );
}
