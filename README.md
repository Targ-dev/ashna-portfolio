# Ashna Alex — Creative Portfolio

A production-quality creative portfolio built with Next.js (App Router), TypeScript,
Tailwind CSS v4, and GSAP + ScrollTrigger, with Lenis for smooth scrolling.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.js`)
- GSAP 3.15 (ScrollTrigger + SplitText — both free in this version) via `@gsap/react`'s `useGSAP`
- Lenis for smooth scrolling, synced to ScrollTrigger's ticker
- lucide-react, clsx, tailwind-merge

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm run start   # production build
```

Fonts (Bricolage Grotesque + Inter) are self-hosted as woff2 files in `app/fonts/`
and loaded with `next/font/local`, so the build works fully offline.

## Structure

```
app/                    layout, page, global styles, local font files
components/
  layout/               Navbar, Footer
  sections/             Hero, ProjectGallery, AboutSection, ExpertiseSection, ContactSection
  ui/                    MagneticButton, CustomCursor, RevealText, SectionLabel, HandwrittenUnderline
  animations/            GSAP plugin registration + Lenis/ScrollTrigger sync
lib/                     projects.ts (data), utils.ts (cn helper)
public/images/           placeholder project artwork (SVG) — swap with real photography
public/video/            drop `about.mp4` here for the scroll-scrubbed showreel
```

## Swapping in real content

- **Projects**: edit `lib/projects.ts` and replace the SVGs in `public/images/` with
  real project photography (same file names, or update the `image` paths).
- **About video**: add a muted, h.264-encoded `about.mp4` to `public/video/`. Until
  a file is present, the About section gracefully falls back to a static poster
  image (this is intentional, per the spec — no broken video element).
- **Copy & socials**: About/Contact copy lives directly in
  `components/sections/AboutSection.tsx` and `ContactSection.tsx`.

## Notable interaction details

- **Hero**: SplitText line-reveal on load, then a scroll-scrubbed parallax
  handoff into the Project Gallery.
- **Project Gallery**: hover-to-expand horizontal rail (click-to-toggle on touch).
- **About**: pinned cinematic sequence — content rises and holds, then a
  full-bleed video panel rises to cover it and its `currentTime` is scrubbed
  directly against scroll progress (forward on scroll down, reverse on scroll up).
- **Expertise**: rows of kinetic typography moving horizontally at different
  scroll-linked speeds.
- **Contact**: magnetic CTA button using `gsap.quickTo`.
- Respects `prefers-reduced-motion`: pinning/scrubbing is skipped and content
  is shown in its resting, fully legible state.
