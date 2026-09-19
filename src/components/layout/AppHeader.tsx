import { BookmarkSimple, CaretRight, DownloadSimple, WifiHigh } from "@phosphor-icons/react";
import type { AppPath, Navigate } from "../../app/navigation";
import { useApp } from "../../app/AppContext";
import { useLiveNow } from "../../hooks/useLiveNow";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { cn } from "../../lib/cn";
import { formatLiveClock } from "../../lib/currentContext";
import { AppBrand } from "./AppBrand";
import { navigationItems } from "./navigationItems";

export function AppHeader({ path, navigate }: { path: AppPath; navigate: Navigate }) {
  const now = useLiveNow();
  const { isInstallable, isStandalone, canPromptDirectly, promptInstall } = usePwaInstall();
  const { journey: { savedJourneys } } = useApp();

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
        <nav className="flex h-full items-center gap-2.5 lg:gap-4 max-md:hidden" aria-label="주요 메뉴">
          {navigationItems.map((item, index) => {
            const currentIndex = navigationItems.findIndex((nav) => nav.path === path);
            const isCurrent = path === item.path;
            const isPassed = currentIndex !== -1 && index < currentIndex;

            return (
              <div key={item.path} className="flex h-full items-center gap-2.5 lg:gap-4">
                <button
                  className={cn(
                    "relative flex h-full items-center border-b-2 border-transparent px-0.5 text-[14px] font-medium transition",
                    isCurrent
                      ? "border-gold text-cream font-semibold"
                      : isPassed
                        ? "text-cream/80 hover:text-cream"
                        : "text-cream/50 hover:text-cream/80",
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => navigate(item.path)}
                  type="button"
                >
                  {item.label}
                </button>

                {index < navigationItems.length - 1 && (
                  <span
                    className={cn(
                      "pointer-events-none flex items-center justify-center transition-colors duration-200",
                      index < currentIndex ? "text-gold/60" : "text-cream/20",
                    )}
                    aria-hidden="true"
                  >
                    <CaretRight size={13} weight={index < currentIndex ? "bold" : "regular"} />
                  </span>
                )}
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
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
          {/* 모바일 저장한 여정 아이콘 버튼 */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cream/20 text-cream/85 transition hover:border-cream/40 hover:text-cream active:scale-95 md:hidden"
            onClick={() => navigate("/trips")}
            type="button"
            aria-label="저장한 여정 보기"
            title="저장한 여정"
          >
            <BookmarkSimple size={18} weight={savedJourneys.length > 0 ? "fill" : "regular"} className={savedJourneys.length > 0 ? "text-gold" : ""} />
            {savedJourneys.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-ink shadow">
                {savedJourneys.length}
              </span>
            )}
          </button>
          {/* 데스크톱 저장한 여정 버튼 */}
          <button
            className="flex h-10 items-center gap-2 border border-cream/20 px-3.5 text-[12px] text-cream/85 transition hover:border-cream/40 hover:text-cream max-md:hidden"
            onClick={() => navigate("/trips")}
            type="button"
          >
            <BookmarkSimple size={18} weight={savedJourneys.length > 0 ? "fill" : "regular"} className={savedJourneys.length > 0 ? "text-gold" : ""} />
            <span>저장한 여정</span>
            {savedJourneys.length > 0 && (
              <span className="ml-0.5 rounded-full bg-gold/20 px-1.5 py-0.2 text-[10px] font-bold text-gold-light">
                {savedJourneys.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
