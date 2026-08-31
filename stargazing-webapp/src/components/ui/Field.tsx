import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Field({ label, action, hint, children, className }: { label: string; action?: ReactNode; hint?: ReactNode; children: ReactNode; className?: string }) {
  return <label className={cn("block", className)}>
    <span className="mb-2 flex min-h-5 items-center justify-between gap-3 text-[12px] font-bold text-ink"><span>{label}</span>{action}</span>
    {children}
    {hint && <span className="mt-1.5 block text-[10px] leading-4 text-stone-500">{hint}</span>}
  </label>;
}

export function FieldFrame({ icon, children, invalid = false }: { icon: ReactNode; children: ReactNode; invalid?: boolean }) {
  return <span className={cn(
    "flex min-h-12 items-center gap-2.5 border bg-white/65 px-3.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-teal/15 [&>svg]:shrink-0 [&>svg]:text-teal",
    invalid ? "border-rust" : "border-[#b8b1a5] focus-within:border-teal",
  )}>{icon}{children}</span>;
}
