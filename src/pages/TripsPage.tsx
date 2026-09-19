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

export function TripsPage({
  navigate,
  planner,
  destination,
  route,
  saved,
  setSaved,
}: {
  navigate: Navigate;
  planner: PlannerState;
  destination: Destination | null;
  route: RouteEstimate | null;
  saved: boolean;
  setSaved: (value: boolean) => void;
}) {
  const sharing = useShareJourney(
    "별보러간다 여정",
    destination ? `${destination.name} 관측 여정` : "관측 여정"
  );
  if (!destination) {
    return (
      <AppPage path="/trips" navigate={navigate}>
        <EmptyState
          title="선택된 여정이 없습니다"
          description="별 관측지를 선택하시면 상세 여정과 인근 캠핑장, 연관 관광지 정보를 확인하실 수 있습니다."
          action={
            <Button onClick={() => navigate("/planner")}>
              관측지 탐색 <ArrowRight />
            </Button>
          }
        />
      </AppPage>
    );
  }
  const arrival = route ? addMinutesToTime(planner.time, route.durationMinutes) : null;
  const stops = [
    {
      time: planner.time,
      title: `${planner.departure} 출발`,
      detail:
        planner.locationSource === "device"
          ? "현재 위치에서 출발"
          : "설정된 출발지에서 출발",
    },
    {
      time: arrival ?? "미계산",
      title: destination.name,
      detail: route
        ? `예상 소요 ${route.duration} (${route.distance})`
        : "위치 설정을 통해 도착 예정 시간을 확인하세요.",
    },
  ];

  const actions = (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => setSaved(!saved)}>
        <BookmarkSimple weight={saved ? "fill" : "regular"} />
        {saved ? "저장됨" : "여정 저장"}
      </Button>
      <Button variant="ghost" onClick={() => void sharing.share()}>
        <ShareNetwork />
        {sharing.shared ? "복사됨" : "공유"}
      </Button>
    </div>
  );

  return (
    <AppPage path="/trips" navigate={navigate}>
      <main
        id="main-content"
        className="mx-auto w-[min(1160px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:py-6"
      >
        <JourneyStepper current={3} />
        <div className="mt-8">
          <PageHeading
            title={<>{destination.name} 관측 여정</>}
            description={`${formatDateInputKorean(planner.date)} 일정 · 출발 이동 경로, 인근 캠핑장 및 연관 관광지`}
            actions={actions}
          />
        </div>
        <JourneyTimeline stops={stops} />
        <JourneyFacts destination={destination} />
        <div className="mt-6 grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <NearbyPlaceList
            title="인근 캠핑장 (20km)"
            items={destination.nearbyCampgrounds}
            empty="반경 내 등록된 캠핑장 정보가 없습니다."
          />
          <NearbyPlaceList
            title="주변 연관 관광지"
            items={destination.relatedPlaces}
            empty="연관 관광지 정보가 없습니다."
          />
        </div>
        <section className="mt-6 grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-line pt-6 max-md:grid-cols-2">
          <div className="max-md:col-span-2">
            <h2 className="font-display text-2xl font-bold">{destination.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
              <MapPin />
              {destination.address || "주소 정보 확인 중"}
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/map")}>
            지도 경로 보기
          </Button>
          <Button onClick={() => navigate("/alerts")}>
            출발 알림 설정
          </Button>
        </section>
      </main>
    </AppPage>
  );
}
