import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "night" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "border-rust bg-rust text-white shadow-[0_12px_30px_rgba(126,55,27,.16)] hover:bg-[#a94f26]",
  secondary: "border-teal/55 bg-transparent text-teal hover:bg-teal/8",
  night: "border-gold bg-gold text-[#241706] shadow-[0_12px_34px_rgba(217,166,79,.16)] hover:bg-gold-light",
  ghost: "border-current/25 bg-transparent text-current hover:bg-current/5",
};

export const buttonClass = (variant: ButtonVariant = "primary", className?: string) => cn(
  "inline-flex min-h-12 items-center justify-center gap-2.5 border px-5 text-[13px] font-bold tracking-[-.01em] transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-45",
  variants[variant],
  className,
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ children, variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} type={type} {...props}>{children}</button>;
}
