import type { ReactNode } from "react";
import type { AppPath, Navigate } from "../../app/navigation";
import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

export function AppPage({ path, navigate, children, tone = "paper", className = "" }: { path: AppPath; navigate: Navigate; children: ReactNode; tone?: "paper" | "night"; className?: string }) {
  return <div className={`${tone === "paper" ? "paper-grid bg-paper text-ink" : "bg-ink text-cream"} min-h-screen pb-20 md:pb-0 ${className}`}><a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-3 focus:text-ink" href="#main-content">본문으로 건너뛰기</a><AppHeader path={path} navigate={navigate} />{children}<BottomNavigation path={path} navigate={navigate} /></div>;
}
