import type { AppPath, Navigate } from "../../app/navigation";
import { cn } from "../../lib/cn";
import { navigationItems } from "./navigationItems";

export function BottomNavigation({ path, navigate }: { path: AppPath; navigate: Navigate }) {
  return <nav className="fixed inset-x-0 bottom-0 z-[70] hidden grid-cols-4 border-t border-cream/15 bg-[#06121efa] pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(0,0,0,.2)] max-md:grid" aria-label="모바일 메뉴">{navigationItems.map((item) => <button className={cn("relative flex min-h-[66px] flex-col items-center justify-center gap-1 text-[10px] transition", path === item.path ? "text-gold-light" : "text-cream/48")} aria-current={path === item.path ? "page" : undefined} key={item.path} onClick={() => navigate(item.path)} type="button">{path === item.path && <i className="absolute inset-x-5 top-0 h-0.5 bg-gold" />}<item.icon size={21} weight={path === item.path ? "fill" : "regular"} />{item.shortLabel}</button>)}</nav>;
}
