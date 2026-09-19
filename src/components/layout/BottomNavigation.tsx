import { CaretRight } from "@phosphor-icons/react";
import type { AppPath, Navigate } from "../../app/navigation";
import { useApp } from "../../app/AppContext";
import { cn } from "../../lib/cn";
import { navigationItems } from "./navigationItems";

export function BottomNavigation({ path, navigate }: { path: AppPath; navigate: Navigate }) {
  const currentIndex = navigationItems.findIndex((item) => item.path === path);
  const { journey: { savedJourneys } } = useApp();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[70] hidden items-center justify-between border-t border-cream/15 bg-[#06121efa] px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(0,0,0,.25)] backdrop-blur-lg max-md:flex"
      aria-label="모바일 메뉴"
    >
      {navigationItems.map((item, index) => {
        const isCurrent = path === item.path;
        const isPassed = currentIndex !== -1 && index < currentIndex;
        const hasSavedBadge = item.path === "/trips" && savedJourneys.length > 0;

        return (
          <div key={item.path} className="flex flex-1 items-center">
            <button
              className={cn(
                "relative flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition active:scale-95",
                isCurrent
                  ? "text-gold-light font-semibold"
                  : isPassed
                    ? "text-cream/70"
                    : "text-cream/40 hover:text-cream/60"
              )}
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => navigate(item.path)}
              type="button"
            >
              {isCurrent && (
                <i className="absolute inset-x-3 top-0 h-[2px] rounded-b-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
              )}
              <div className="relative">
                <item.icon
                  size={20}
                  weight={isCurrent ? "fill" : isPassed ? "duotone" : "regular"}
                />
                {hasSavedBadge && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-ink shadow-[0_0_6px_rgba(212,175,55,0.5)]">
                    {savedJourneys.length}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>

            {index < navigationItems.length - 1 && (
              <span
                className={cn(
                  "pointer-events-none -mx-1 flex shrink-0 items-center justify-center transition-colors duration-200",
                  index < currentIndex
                    ? "text-gold/60"
                    : "text-cream/18"
                )}
                aria-hidden="true"
              >
                <CaretRight size={11} weight={index < currentIndex ? "bold" : "regular"} />
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

