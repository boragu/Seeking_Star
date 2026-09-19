import { BookmarkSimple, DownloadSimple, List, WifiHigh, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { AppPath, Navigate } from "../../app/navigation";
import { useLiveNow } from "../../hooks/useLiveNow";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { cn } from "../../lib/cn";
import { formatLiveClock } from "../../lib/currentContext";
import { AppBrand } from "./AppBrand";
import { navigationItems } from "./navigationItems";

export function AppHeader({ path, navigate }: { path: AppPath; navigate: Navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useLiveNow();
  const { isInstallable, isStandalone, canPromptDirectly, promptInstall } = usePwaInstall();
  useEffect(() => setMenuOpen(false), [path]);

  const handleHeaderInstall = () => {
    if (canPromptDirectly) {
      void promptInstall();
    } else {
      navigate("/alerts");
    }
  };

  return <header className="sticky top-0 z-50 border-b border-cream/10 bg-[#06121ef2] text-cream/80 backdrop-blur-xl">
    <div className="mx-auto grid min-h-[76px] w-[min(1440px,calc(100%-64px))] grid-cols-[260px_1fr_auto] items-center max-lg:w-[calc(100%-40px)] max-lg:grid-cols-[210px_1fr_auto] max-md:min-h-[62px] max-md:w-[calc(100%-32px)] max-md:grid-cols-[1fr_auto]">
      <AppBrand navigate={navigate} />
      <nav className="flex h-full gap-9 max-lg:gap-5 max-md:hidden" aria-label="주요 메뉴">{navigationItems.map((item) => <button className={cn("relative h-full border-b-2 border-transparent px-0 text-[14px] font-medium transition", path === item.path ? "border-gold text-cream" : "text-cream/58 hover:text-cream")} aria-current={path === item.path ? "page" : undefined} key={item.path} onClick={() => navigate(item.path)} type="button">{item.label}</button>)}</nav>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] text-[#86b4a3] max-lg:hidden"><WifiHigh weight="bold" /> {formatLiveClock(now)} 현재</span>
        {isInstallable && !isStandalone && (
          <button
            className="flex h-10 items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 text-[12px] font-medium text-gold-light transition hover:bg-gold/20 max-sm:hidden"
            onClick={handleHeaderInstall}
            type="button"
          >
            <DownloadSimple size={16} weight="bold" /> 앱 설치
          </button>
        )}
        <button className="flex h-10 items-center gap-2 border border-cream/20 px-3.5 text-[12px] text-cream/85 transition hover:border-cream/40 hover:text-cream max-md:hidden" onClick={() => navigate("/trips")} type="button"><BookmarkSimple size={18} /> 저장한 여정</button>
        <button className="hidden size-9 place-items-center border border-cream/25 max-md:grid" aria-expanded={menuOpen} aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"} onClick={() => setMenuOpen((open) => !open)} type="button">{menuOpen ? <X /> : <List />}</button>
      </div>
    </div>
    {menuOpen && <nav className="absolute inset-x-3 top-[62px] grid grid-cols-2 gap-px border border-cream/20 bg-ink p-1 shadow-2xl md:hidden" aria-label="펼친 메뉴">
      {navigationItems.map((item) => <button className={cn("flex min-h-12 items-center gap-2 px-4 text-left text-[13px]", path === item.path ? "bg-gold/10 text-gold-light" : "text-cream/65")} aria-current={path === item.path ? "page" : undefined} key={item.path} onClick={() => navigate(item.path)} type="button"><item.icon /> {item.label}</button>)}
      {isInstallable && !isStandalone && (
        <button
          className="col-span-2 flex min-h-12 items-center justify-center gap-2 bg-gold/15 px-4 text-[13px] font-bold text-gold-light"
          onClick={handleHeaderInstall}
          type="button"
        >
          <DownloadSimple size={18} weight="bold" /> 앱으로 홈 화면에 설치하기
        </button>
      )}
    </nav>}
  </header>;
}
