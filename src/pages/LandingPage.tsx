import { ArrowRight, CalendarBlank, Crosshair, MapPin } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppHeader } from "../components/layout/AppHeader";
import { PwaInstallBanner } from "../components/layout/PwaInstallBanner";
import { Button } from "../components/ui/Button";
import { HeroGuide } from "../features/landing/HeroGuide";
import { formatShortKoreanDate } from "../lib/currentContext";

export function LandingPage({ navigate }: { navigate: Navigate }) {
  const { planner, location } = useApp();
  return (
    <div className="min-h-screen bg-ink text-cream">
      <AppHeader path="/" navigate={navigate} />
      <main id="main-content" className="hero-art relative min-h-[calc(100vh-132px)] overflow-hidden max-md:min-h-[calc(100dvh-62px)]">
        <div className="star-haze pointer-events-none absolute inset-0" />
        <section className="relative z-10 mx-auto w-[min(1440px,calc(100%-80px))] pb-24 pt-[88px] max-lg:w-[calc(100%-48px)] max-md:w-[calc(100%-40px)] max-md:pb-24 max-md:pt-12">
          <div className="mb-10 flex items-center gap-5 text-[12px] text-cream/65 max-md:flex-wrap max-md:gap-3 max-md:text-[11px]">
            <span className="flex items-center gap-2"><CalendarBlank /> {formatShortKoreanDate(new Date())}</span>
            <i className="h-3 w-px bg-cream/20" />
            <button
              type="button"
              onClick={location.request}
              className="flex items-center gap-2 hover:text-gold-light transition cursor-pointer"
              title="내 현재 GPS 위치로 설정"
            >
              {planner.locationSource === "device" ? <Crosshair className="text-teal-300" /> : <MapPin />}
              <span>{planner.departure}</span>
              {planner.locationSource !== "device" && (
                <span className="rounded bg-cream/10 px-1.5 py-0.5 text-[10px] font-medium text-gold-light hover:bg-cream/20">
                  내 위치 불러오기
                </span>
              )}
            </button>
          </div>
          <h1 className="my-5 max-w-[820px] font-display text-[clamp(44px,5.2vw,74px)] font-bold leading-[1.14] tracking-[-0.05em] max-md:text-[clamp(36px,10vw,48px)]">
            혼잡한 명소 대신,<br />
            <em className="not-italic text-gold">한적한 별 관측지</em>로
          </h1>
          <p className="max-w-xl text-[15px] leading-8 text-cream/70 max-md:text-[13px] max-md:leading-7">
            출발 위치와 시간을 바탕으로 혼잡도가 낮고 관측 여건이 좋은 장소와 인근 캠핑장을 안내합니다.
          </p>
          <div className="mt-9 flex gap-3 max-sm:grid">
            <Button variant="night" onClick={() => navigate("/planner")}>
              별 관측지 찾기 <ArrowRight />
            </Button>
            <Button variant="ghost" className="border-cream/28 text-cream" onClick={() => navigate("/map")}>
              지도 둘러보기
            </Button>
          </div>
          <HeroGuide />
        </section>
      </main>
      <footer className="mx-auto flex min-h-14 w-[min(1440px,calc(100%-80px))] items-center justify-between text-[11px] text-cream/45 max-md:hidden">
        <span>한국관광공사 TourAPI · 고캠핑 공공데이터 연계</span>
        <span>강원권 야간 관광지 혼잡 분산 안내</span>
      </footer>
      <PwaInstallBanner />
    </div>
  );
}
