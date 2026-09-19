import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "paper" | "night" | "subtle";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export function Skeleton({
  variant = "paper",
  rounded = "md",
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    paper: "animate-shimmer bg-line/30",
    night: "animate-shimmer-night bg-white/5",
    subtle: "animate-pulse bg-line/20",
  }[variant];

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${roundedStyles} ${variantStyles} ${className}`}
      style={style}
      {...props}
    />
  );
}
