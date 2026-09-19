import { useState } from "react";
import { Eye, ListBullets, Sparkle } from "@phosphor-icons/react";
import type { ApiRequestError, RecommendationResponse } from "../api/contracts";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { PageHeading } from "../components/ui/PageHeading";
import { DestinationSpotlight } from "../features/planner/components/DestinationSpotlight";
import { PlannerForm } from "../features/planner/components/PlannerForm";
import { DestinationListView } from "../features/recommendations/components/DestinationListView";
import { RecommendationState } from "../features/recommendations/components/RecommendationState";
import { SourceNote } from "../features/recommendations/components/SourceNote";

interface PlannerPageProps {
  navigate: Navigate;
}

export function PlannerPage({ navigate }: PlannerPageProps) {
  const {
    planner,
    setPlanner,
    ranked,
    destination: selected,
    journey: { setSelectedId },
    recommendations: { status, error, data, reload },
    location: { feedback: locationFeedback, request: requestCurrentLocation }
  } = useApp();

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  const handleSelectDestination = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  const handleReload = () => {
    void reload();
    // 새 검색 시에도 목록 뷰에서 전체를 훑어볼 수 있도록 list 모드로 전환
    setViewMode("list");
  };

  const renderRecommendationContent = () => {
    if (status === "idle") {
      return <RecommendationState status="idle" onRetry={handleReload} />;
    }
    if (status === "loading") {
      return <RecommendationState status="loading" onRetry={handleReload} />;
    }
    if (status === "error") {
      return (
        <RecommendationState
          status="error"
          errorCode={error?.code}
          message={error?.message}
          onRetry={handleReload}
        />
      );
    }
    if (ranked.length === 0 || !selected) {
      return (
        <RecommendationState
          status="empty"
          message="현재 조건에 부합하는 별 관측지를 찾지 못했습니다."
          onRetry={handleReload}
        />
      );
    }

    return (
      <div className="space-y-3">
        {/* 상단 뷰 모드 전환 탭 (목록 보기 ↔ 상세 분석 보기) */}
        <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
          <div className="flex items-center gap-1.5 bg-paper/90 p-1 rounded-lg border border-line">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-bold transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-teal text-white shadow-xs"
                  : "text-stone-600 hover:text-ink hover:bg-white/60"
              }`}
            >
              <ListBullets size={15} />
              <span>추천 후보 목록 ({ranked.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("detail")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-bold transition cursor-pointer ${
                viewMode === "detail"
                  ? "bg-teal text-white shadow-xs"
                  : "text-stone-600 hover:text-ink hover:bg-white/60"
              }`}
            >
              <Eye size={15} />
              <span className="truncate max-w-[130px]">{selected.name} 상세</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-500 hidden sm:inline-block">
            {viewMode === "list" ? "카드를 눌러 상세 분석을 확인하세요" : "상단 칩 또는 목록으로 빠른 전환 가능"}
          </span>
        </div>

        {/* 뷰 렌더링 */}
        {viewMode === "list" ? (
          <DestinationListView
            items={ranked}
            selectedId={selected?.id ?? null}
            onSelect={handleSelectDestination}
          />
        ) : (
          <DestinationSpotlight
            destination={selected}
            items={ranked}
            navigate={navigate}
            onSelect={setSelectedId}
            onBackToList={() => setViewMode("list")}
          />
        )}
      </div>
    );
  };

  return (
    <AppPage path="/planner" navigate={navigate}>
      <main
        id="main-content"
        className="mx-auto w-[min(1280px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:pt-6 max-md:pb-24"
      >
        <PageHeading
          title="별 관측지 탐색 및 추천"
          description="출발 위치와 일정을 입력하시면 혼잡도, 이동 거리, 인근 체류지를 종합 분석하여 최적의 장소를 안내합니다."
        />
        <div className="grid grid-cols-[minmax(320px,.82fr)_minmax(560px,1.7fr)] gap-6 max-lg:grid-cols-[350px_1fr] max-md:grid-cols-1">
          <PlannerForm
            planner={planner}
            setPlanner={setPlanner}
            status={status}
            locationFeedback={locationFeedback}
            requestCurrentLocation={requestCurrentLocation}
            reload={handleReload}
          />
          {renderRecommendationContent()}
        </div>
        {data && <SourceNote sources={data.sources} generatedAt={data.generatedAt} />}
      </main>
    </AppPage>
  );
}
