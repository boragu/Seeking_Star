import { Sparkle } from "@phosphor-icons/react";
import type { Navigate } from "../../app/navigation";
import { cn } from "../../lib/cn";

export function AppBrand({ navigate, compact = false }: { navigate: Navigate; compact?: boolean }) {
  return <button className={cn("inline-flex items-start gap-1 bg-transparent font-display font-bold leading-none text-cream", compact ? "text-lg" : "text-[28px] max-md:text-[22px]")} onClick={() => navigate("/")} type="button" aria-label="별보러간다 홈"><span>별보러간다</span><Sparkle className="size-4 text-gold" weight="fill" /></button>;
}
