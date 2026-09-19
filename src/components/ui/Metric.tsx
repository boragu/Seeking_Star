import type { Icon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

export function Metric({ icon: IconComponent, label, value, dark = false }: { icon: Icon; label: string; value: string; dark?: boolean }) {
  return <div className={cn("flex min-h-[76px] items-center gap-3 px-4 py-3", dark ? "text-cream" : "text-ink")}>
    <IconComponent className={dark ? "text-[#8ec0b2]" : "text-teal"} size={23} />
    <span className={cn("flex min-w-0 flex-col text-[10px]", dark ? "text-cream/48" : "text-stone-500")}>{label}<strong className={cn("mt-0.5 truncate font-display text-[15px]", dark ? "text-cream" : "text-ink")}>{value}</strong></span>
  </div>;
}
