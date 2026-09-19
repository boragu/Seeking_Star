import { Sparkle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

export interface AiBadgeProps {
  label?: string;
  className?: string;
  variant?: "teal" | "gold" | "dark" | "subtle";
  size?: "sm" | "md";
}

export function AiBadge({
  label = "AI",
  className,
  variant = "teal",
  size = "sm",
}: AiBadgeProps) {
  const variantStyles = {
    teal: "bg-teal/10 text-teal border-teal/20",
    gold: "bg-gold/15 text-gold-dark border-gold/30 dark:text-gold-light",
    dark: "bg-white/10 text-gold-light border-white/20 shadow-xs",
    subtle: "bg-stone-100 text-stone-600 border-stone-200",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-0.5 text-[11px] gap-1.5",
  };

  const iconSizes = {
    sm: 11,
    md: 13,
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap select-none rounded border font-sans font-bold leading-none tracking-tight",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Sparkle size={iconSizes[size]} weight="fill" className="shrink-0" />
      <span className="shrink-0 whitespace-nowrap">{label}</span>
    </span>
  );
}
