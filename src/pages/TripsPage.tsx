import { useState } from "react";
import { ArrowRight, BookmarkSimple, FolderStar, ListChecks, MapPin, ShareNetwork } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeading } from "../components/ui/PageHeading";
import { JourneyFacts } from "../features/journey/components/JourneyFacts";
import { JourneyTimeline } from "../features/journey/components/JourneyTimeline";
import { NearbyPlaceList } from "../features/journey/components/NearbyPlaceList";
import { ObservationGuide } from "../features/journey/components/ObservationGuide";
import { SavedJourneyList } from "../features/journey/components/SavedJourneyList";
import { useShareJourney } from "../features/journey/useShareJourney";
import { addMinutesToTime, formatDateInputKorean } from "../lib/currentContext";

export function TripsPage({ navigate }: { navigate: Navigate }) {
  const {
    planner,
    destination,
    route,
    journey: {
      selectedId,
      setSelectedId,
      savedJourneys,
      isSaved,
      toggleSave,
      removeSaved,
    },
  } = useApp();

  const [activeTab, setActiveTab] = useState<"detail" | "vault">(() => {
    return !destination && savedJourneys.length > 0 ? "vault" : "detail";
  });

  const isCurrentSaved = isSaved(destination?.id);

  const sharing = useShareJourney(
    "별보러간다 여정",
    destination ? `${destination.name} 관측 여정` : "관측 여정"
  );

  const handleSelectFromVault = (destId: string) => {
    setSelectedId(destId);
    setActiveTab("detail");
  };

  const actions = activeTab === "detail" && destination ? (
    <div className="flex gap-2">
      <Button
        variant={isCurrentSaved ? "secondary" : "primary"}
        onClick={() => toggleSave(destination, planner)}
      >
        <BookmarkSimple weight={isCurrentSaved ? "fill" : "regular"} />
        {isCurrentSaved ? "보관함 저장됨" : "여정 저장"}
      </Button>
      <Button variant="ghost" onClick={() => void sharing.share()}>
        <ShareNetwork />
        {sharing.shared ? "복사됨" : "공유"}
      </Button>
    </div>
  ) : (
    <Button variant="secondary" onClick={() => navigate("/planner")}>
      새 관측지 탐색 <ArrowRight />
    </Button>
  );

  return (
    <AppPage path="/trips" navigate={navigate}>
      <main
        id="main-content"
        className="mx-auto w-[min(1160px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:py-6"
      >
        <JourneyStepper current={3} />

        {/* 상단 탭 전환: 현재 여정 상세 vs 여정 보관함 */}
        <div className="mt-8 flex items-center justify-between border-b border-line pb-4 max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-bold transition ${
                activeTab === "detail"
                  ? "bg-teal text-white shadow-sm"
                  : "bg-white/40 text-stone-600 hover:bg-white/80"
              }`}
              onClick={() => setActiveTab("detail")}
              type="button"
            >
              <ListChecks size={18} />
              현재 여정 상세
            </button>
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-bold transition ${
                activeTab === "vault"
                  ? "bg-teal text-white shadow-sm"
                  : "bg-white/40 text-stone-600 hover:bg-white/80"
              }`}
              onClick={() => setActiveTab("vault")}
              type="button"
            >
              <FolderStar size={18} />
              여정 보관함
              <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] ${
                activeTab === "vault" ? "bg-white/20 text-white" : "bg-teal/10 text-teal"
              }`}>
                {savedJourneys.length}
              </span>
            </button>
          </div>

          <div>{actions}</div>
        </div>

        {/* 탭 1: 현재 여정 상세 보기 */}
        {activeTab === "detail" && (
          <>
            {!destination ? (
              <div className="py-12">
                <EmptyState
                  title="선택된 활성 여정이 없습니다"
                  description="추천 관측지를 선택하시거나, 여정 보관함에 저장된 여정을 불러와 상세 일정을 확인해 보세요."
                  action={
                    <div className="flex gap-3">
                      <Button onClick={() => navigate("/planner")}>
                        관측지 탐색 <ArrowRight />
                      </Button>
                      {savedJourneys.length > 0 && (
                        <Button variant="secondary" onClick={() => setActiveTab("vault")}>
                          보관함 열기 ({savedJourneys.length})
                        </Button>
                      )}
                    </div>
                  }
                />
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <PageHeading
                    title={<>{destination.name} 관측 여정</>}
                    description={`${formatDateInputKorean(planner.date)} 일정 · ${planner.departure} 출발 이동 경로, 인근 캠핑장 및 연관 관광지`}
                  />
                </div>

                <JourneyTimeline
                  stops={[
                    {
                      time: planner.time,
                      title: `${planner.departure} 출발`,
                      detail:
                        planner.locationSource === "device"
                          ? "현재 위치에서 출발"
                          : "설정된 출발지에서 출발",
                    },
                    {
                      time: route ? addMinutesToTime(planner.time, route.durationMinutes) : "미계산",
                      title: destination.name,
                      detail: route
                        ? `예상 소요 ${route.duration} (${route.distance})`
                        : "위치 설정을 통해 도착 예정 시간을 확인하세요.",
                    },
                  ]}
                />

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

                <ObservationGuide destination={destination} planner={planner} route={route} />

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
              </>
            )}
          </>
        )}

        {/* 탭 2: 여정 보관함 목록 보기 */}
        {activeTab === "vault" && (
          <div className="mt-6">
            <SavedJourneyList
              items={savedJourneys}
              selectedId={selectedId}
              onSelect={handleSelectFromVault}
              onRemove={removeSaved}
              onExplore={() => navigate("/planner")}
            />
          </div>
        )}
      </main>
    </AppPage>
  );
}
