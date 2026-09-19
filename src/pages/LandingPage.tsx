import { ArrowRight, BookmarkSimple, CalendarBlank, CaretRight, Crosshair, MapPin } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppHeader } from "../components/layout/AppHeader";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { PwaInstallBanner } from "../components/layout/PwaInstallBanner";
import { Button } from "../components/ui/Button";
import { HeroGuide } from "../features/landing/HeroGuide";
import { formatDateInputKorean, formatShortKoreanDate } from "../lib/currentContext";

export function LandingPage({ navigate }: { navigate: Navigate }) {
  const {
    planner,
    setPlanner,
    location,
    journey: { savedJourneys, setSelectedId },
  } = useApp();

  return (
    <div className="min-h-screen bg-ink text-cream pb-20 md:pb-0">
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

          <div className="mt-9 flex flex-wrap gap-3 max-sm:grid">
            <Button variant="night" onClick={() => navigate("/planner")}>
              별 관측지 찾기 <ArrowRight />
            </Button>
            <Button variant="ghost" className="border-cream/28 text-cream" onClick={() => navigate("/map")}>
              지도 둘러보기
            </Button>
            <Button
              variant="ghost"
              className="border-cream/28 text-cream flex items-center gap-1.5"
              onClick={() => navigate("/trips")}
            >
              <BookmarkSimple size={16} weight={savedJourneys.length > 0 ? "fill" : "regular"} className={savedJourneys.length > 0 ? "text-gold" : ""} />
              저장한 여정
              {savedJourneys.length > 0 && (
                <span className="rounded-full bg-gold/20 px-1.5 py-0.2 text-[11px] font-semibold text-gold-light">
                  {savedJourneys.length}
                </span>
              )}
            </Button>
          </div>

          {/* 저장된 여정 바로가기 카드 (저장된 여정이 있을 때 노출) */}
          {savedJourneys.length > 0 && (
            <div className="mt-8 max-w-[690px] rounded-xl border border-gold/30 bg-[#071926cc] p-4.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition hover:border-gold/50">
              <div className="flex items-center justify-between border-b border-cream/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/20 text-gold-light">
                    <BookmarkSimple size={15} weight="fill" />
                  </span>
                  <span className="text-[13px] font-bold text-cream">저장된 관측 여정</span>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold-light">
                    {savedJourneys.length}개 보관 중
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/trips")}
                  className="flex items-center gap-1 text-[12px] font-medium text-cream/70 hover:text-gold-light transition"
                >
                  전체 보기 <CaretRight size={12} />
                </button>
              </div>

              {savedJourneys[0] && (
                <div className="mt-3 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[15px] text-cream truncate">
                        {savedJourneys[0].destinationName}
                      </h3>
                      <span className="shrink-0 rounded bg-cream/10 px-1.5 py-0.5 text-[10px] text-cream/70">
                        {savedJourneys[0].destinationRegion}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-cream/60 truncate">
                      {savedJourneys[0].departureName} 출발 · {formatDateInputKorean(savedJourneys[0].date)} {savedJourneys[0].departureTime}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const item = savedJourneys[0];
                      setSelectedId(item.destinationId);
                      if (item.planner) {
                        setPlanner((prev) => ({ ...prev, ...item.planner }));
                      } else {
                        setPlanner((prev) => ({
                          ...prev,
                          departure: item.departureName || prev.departure,
                          date: item.date || prev.date,
                          time: item.departureTime || prev.time,
                        }));
                      }
                      navigate("/trips");
                    }}
                    className="shrink-0 flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-[12px] font-bold text-ink shadow hover:bg-gold-light transition active:scale-95 max-sm:w-full max-sm:justify-center"
                  >
                    <span>여정 상세 보기</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                </div>
              )}
            </div>
          )}

          <HeroGuide />
        </section>
      </main>
      <footer className="mx-auto flex min-h-14 w-[min(1440px,calc(100%-80px))] items-center justify-between text-[11px] text-cream/45 max-md:hidden">
        <span>한국관광공사 TourAPI · 고캠핑 공공데이터 연계</span>
        <span>강원권 야간 관광지 혼잡 분산 안내</span>
      </footer>
      <BottomNavigation path="/" navigate={navigate} />
      <PwaInstallBanner />
    </div>
  );
}
