import { BookmarkSimple, DownloadSimple, WifiHigh } from "@phosphor-icons/react";
import type { AppPath, Navigate } from "../../app/navigation";
import { useLiveNow } from "../../hooks/useLiveNow";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { cn } from "../../lib/cn";
import { formatLiveClock } from "../../lib/currentContext";
import { AppBrand } from "./AppBrand";
import { navigationItems } from "./navigationItems";

export function AppHeader({ path, navigate }: { path: AppPath; navigate: Navigate }) {
  const now = useLiveNow();
  const { isInstallable, isStandalone, canPromptDirectly, promptInstall } = usePwaInstall();

  const handleHeaderInstall = () => {
    if (canPromptDirectly) {
      void promptInstall();
    } else {
      navigate("/alerts");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-[#06121ef2] text-cream/80 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[76px] w-[min(1440px,calc(100%-64px))] grid-cols-[260px_1fr_auto] items-center max-lg:w-[calc(100%-40px)] max-lg:grid-cols-[210px_1fr_auto] max-md:min-h-[62px] max-md:w-[calc(100%-32px)] max-md:grid-cols-[1fr_auto]">
        <AppBrand navigate={navigate} />
        <nav className="flex h-full gap-9 max-lg:gap-5 max-md:hidden" aria-label="주요 메뉴">
          {navigationItems.map((item) => (
            <button
              className={cn(
                "relative h-full border-b-2 border-transparent px-0 text-[14px] font-medium transition",
                path === item.path ? "border-gold text-cream" : "text-cream/58 hover:text-cream",
              )}
              aria-current={path === item.path ? "page" : undefined}
              key={item.path}
              onClick={() => navigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[#86b4a3] max-lg:hidden">
            <WifiHigh weight="bold" /> {formatLiveClock(now)} 현재
          </span>
          {isInstallable && !isStandalone && (
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-2.5 text-[12px] font-medium text-gold-light transition hover:bg-gold/20 active:scale-95 sm:h-10 sm:px-3"
              onClick={handleHeaderInstall}
              type="button"
            >
              <DownloadSimple size={16} weight="bold" /> 앱 설치
            </button>
          )}
          <button
            className="flex h-10 items-center gap-2 border border-cream/20 px-3.5 text-[12px] text-cream/85 transition hover:border-cream/40 hover:text-cream max-md:hidden"
            onClick={() => navigate("/trips")}
            type="button"
          >
            <BookmarkSimple size={18} /> 저장한 여정
          </button>
        </div>
      </div>
    </header>
  );
}
