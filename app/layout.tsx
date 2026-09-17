import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/animations/smooth-scroll";
import CustomCursor from "@/components/ui/CustomCursor";

const bricolage = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashna Alex — Creative Designer",
  description:
    "Ashna Alex is a multidisciplinary Creative Designer working across branding, UI design, packaging, motion graphics and AI-assisted creative production.",
  openGraph: {
    title: "Ashna Alex — Creative Designer",
    description:
      "Building visual identities, digital experiences and motion-led interfaces.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
