import { cn } from "@/lib/utils";

interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
  dark?: boolean;
}

export default function SectionLabel({ index, label, className, dark }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-[11px] uppercase tracking-[0.25em]",
        dark ? "text-[var(--color-paper)]/60" : "text-[var(--color-ink)]/50",
        className
      )}
    >
      <span className="font-display">{index}</span>
      <span className="h-px w-8 bg-current opacity-40" />
      <span>{label}</span>
    </div>
  );
}
