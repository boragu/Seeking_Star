import type { ApiRequestError, RecommendationResponse } from "../api/contracts";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { PageHeading } from "../components/ui/PageHeading";
import { DestinationSpotlight } from "../features/planner/components/DestinationSpotlight";
import { PlannerForm } from "../features/planner/components/PlannerForm";
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

  const recommendationView =
    status === "loading" || status === "idle" ? (
      <RecommendationState status="loading" onRetry={() => void reload()} />
    ) : status === "error" ? (
      <RecommendationState
        status="error"
        errorCode={error?.code}
        message={error?.message}
        onRetry={() => void reload()}
      />
    ) : selected ? (
      <DestinationSpotlight
        destination={selected}
        items={ranked}
        navigate={navigate}
        onSelect={setSelectedId}
      />
    ) : (
      <RecommendationState
        status="empty"
        message="현재 조건에 부합하는 별 관측지를 찾지 못했습니다."
        onRetry={() => void reload()}
      />
    );

  return (
    <AppPage path="/planner" navigate={navigate}>
      <main
        id="main-content"
        className="mx-auto w-[min(1280px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:py-6"
      >
        <JourneyStepper current={1} />
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
            reload={() => void reload()}
          />
          {recommendationView}
        </div>
        {data && <SourceNote sources={data.sources} generatedAt={data.generatedAt} />}
      </main>
    </AppPage>
  );
}
