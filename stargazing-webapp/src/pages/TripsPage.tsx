import { ArrowRight, BookmarkSimple, MapPin, ShareNetwork } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeading } from "../components/ui/PageHeading";
import type { Destination, PlannerState, RouteEstimate } from "../domain/types";
import { JourneyFacts } from "../features/journey/components/JourneyFacts";
import { JourneyTimeline } from "../features/journey/components/JourneyTimeline";
import { NearbyPlaceList } from "../features/journey/components/NearbyPlaceList";
import { useShareJourney } from "../features/journey/useShareJourney";
import { addMinutesToTime, formatDateInputKorean } from "../lib/currentContext";

export function TripsPage({ navigate, planner, destination, route, saved, setSaved }: { navigate: Navigate; planner: PlannerState; destination: Destination | null; route: RouteEstimate | null; saved: boolean; setSaved: (value: boolean) => void }) {
  const sharing = useShareJourney("별보러간다 여정", destination ? `${destination.name} 별보기 여정` : "별보기 여정");
  if (!destination) return <AppPage path="/trips" navigate={navigate}><EmptyState title="아직 선택한 장소가 없어요" description="오늘의 별에서 마음에 드는 장소를 먼저 골라 주세요." action={<Button onClick={() => navigate("/planner")}>장소 찾기 <ArrowRight /></Button>} /></AppPage>;
  const arrival = route ? addMinutesToTime(planner.time, route.durationMinutes) : null;
  const stops = [
    { time: planner.time, title: `${planner.departure} 출발`, detail: planner.locationSource === "device" ? "현재 위치에서 여정을 시작해요." : "입력한 출발지에서 여정을 시작해요." },
    { time: arrival ?? "미계산", title: destination.name, detail: route ? `${route.duration} 예상 이동 · ${route.distance}` : "현재 위치를 설정하면 예상 도착 시각을 확인할 수 있어요." },
  ];

  const actions = <div className="flex gap-2"><Button variant="secondary" onClick={() => setSaved(!saved)}><BookmarkSimple weight={saved ? "fill" : "regular"} />{saved ? "저장됨" : "저장"}</Button><Button variant="ghost" onClick={() => void sharing.share()}><ShareNetwork />{sharing.shared ? "복사됨" : "공유"}</Button></div>;
  return <AppPage path="/trips" navigate={navigate}>
    <main id="main-content" className="mx-auto w-[min(1160px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:py-6">
      <JourneyStepper current={3} />
      <div className="mt-8"><PageHeading eyebrow={formatDateInputKorean(planner.date)} title={<>{destination.name}으로 가는 밤</>} description="출발부터 도착, 머무를 곳과 주변 여행지까지 한 장의 여정으로 정리했어요." actions={actions} /></div>
      <JourneyTimeline stops={stops} />
      <JourneyFacts destination={destination} />
      <div className="mt-6 grid grid-cols-2 gap-5 max-md:grid-cols-1"><NearbyPlaceList eyebrow="STAY NEARBY" title="가까운 캠핑장" items={destination.nearbyCampgrounds} empty="가까운 캠핑장을 찾지 못했어요." /><NearbyPlaceList eyebrow="AROUND THE SKY" title="함께 둘러볼 곳" items={destination.relatedPlaces} empty="함께 둘러볼 장소를 찾지 못했어요." tone="rust" /></div>
      <section className="mt-6 grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-line pt-6 max-md:grid-cols-2"><div className="max-md:col-span-2"><span className="text-[10px] font-bold tracking-[.12em] text-rust">SELECTED PLACE</span><h2 className="mt-1 font-display text-2xl font-bold">{destination.name}</h2><p className="mt-1 flex items-center gap-1 text-[10px] text-stone-500"><MapPin />{destination.address || "주소 정보 확인 중"}</p></div><Button variant="secondary" onClick={() => navigate("/map")}>지도 다시 보기</Button><Button onClick={() => navigate("/alerts")}>출발 전 알림</Button></section>
    </main>
  </AppPage>;
}
