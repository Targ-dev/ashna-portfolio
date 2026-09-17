import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] px-5 py-8 md:px-10">
      <div className="flex flex-col items-start justify-between gap-4 text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/50 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Ashna Alex. All rights reserved.</span>
        <a href="#top" className="flex items-center gap-2 hover:text-[var(--color-ink)]" data-cursor="up">
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
