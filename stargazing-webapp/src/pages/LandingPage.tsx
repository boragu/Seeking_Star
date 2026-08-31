import { ArrowRight, CalendarBlank, Crosshair, MapPin } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { AppHeader } from "../components/layout/AppHeader";
import { Button } from "../components/ui/Button";
import type { PlannerState } from "../domain/types";
import { HeroGuide } from "../features/landing/HeroGuide";
import { formatShortKoreanDate } from "../lib/currentContext";

export function LandingPage({ navigate, planner }: { navigate: Navigate; planner: PlannerState }) {
  return <div className="min-h-screen bg-ink text-cream max-md:-mb-[66px]">
    <AppHeader path="/" navigate={navigate} />
    <main id="main-content" className="hero-art relative min-h-[calc(100vh-132px)] overflow-hidden max-md:min-h-[calc(100dvh-62px)]">
      <div className="star-haze pointer-events-none absolute inset-0" />
      <section className="relative z-10 mx-auto w-[min(1440px,calc(100%-80px))] pb-24 pt-[88px] max-lg:w-[calc(100%-48px)] max-md:w-[calc(100%-40px)] max-md:pb-24 max-md:pt-12">
        <div className="mb-10 flex items-center gap-5 text-[12px] text-cream/65 max-md:flex-wrap max-md:gap-3 max-md:text-[11px]"><span className="flex items-center gap-2"><CalendarBlank /> {formatShortKoreanDate(new Date())}</span><i className="h-3 w-px bg-cream/20" /><span className="flex items-center gap-2">{planner.locationSource === "device" ? <Crosshair /> : <MapPin />} {planner.departure}</span></div>
        <p className="text-[11px] font-bold tracking-[0.18em] text-gold-light">QUIET NIGHT JOURNEY</p>
        <h1 className="my-5 max-w-[820px] font-display text-[clamp(50px,5.6vw,82px)] font-normal leading-[1.12] tracking-[-0.065em] max-md:text-[clamp(42px,12vw,58px)]">붐비는 명소 대신,<br /><em className="not-italic text-gold">나에게 맞는 밤하늘</em>로</h1>
        <p className="max-w-xl text-[15px] leading-8 text-cream/68 max-md:text-[13px] max-md:leading-7">오늘의 출발 시간과 위치를 읽고, 더 한적하게 별을 볼 수 있는 장소와 머무를 곳을 함께 찾아드려요.</p>
        <div className="mt-9 flex gap-3 max-sm:grid"><Button variant="night" onClick={() => navigate("/planner")}>오늘 밤 장소 찾기 <ArrowRight /></Button><Button variant="ghost" className="border-cream/28 text-cream" onClick={() => navigate("/map")}>별지도 보기</Button></div>
        <HeroGuide />
      </section>
    </main>
    <footer className="mx-auto flex min-h-14 w-[min(1440px,calc(100%-80px))] items-center justify-between text-[10px] text-cream/38 max-md:hidden"><span>한국관광공사 TourAPI · 고캠핑</span><span>별을 보러 가는 밤이, 조금 더 고요하도록.</span></footer>
  </div>;
}
