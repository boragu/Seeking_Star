import type { ApiRequestError, RecommendationResponse } from "../api/contracts";
import type { Navigate } from "../app/navigation";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { PageHeading } from "../components/ui/PageHeading";
import type { PlannerState } from "../domain/types";
import type { LocationFeedback } from "../features/location/useDeviceLocation";
import { DestinationSpotlight } from "../features/planner/components/DestinationSpotlight";
import { PlannerForm } from "../features/planner/components/PlannerForm";
import { RecommendationState } from "../features/recommendations/components/RecommendationState";
import { SourceNote } from "../features/recommendations/components/SourceNote";
import type { RankedDestination } from "../lib/recommendationEngine";

interface PlannerPageProps {
  navigate: Navigate;
  planner: PlannerState;
  setPlanner: React.Dispatch<React.SetStateAction<PlannerState>>;
  ranked: RankedDestination[];
  selected: RankedDestination | null;
  setSelectedId: (id: string) => void;
  status: "idle" | "loading" | "success" | "error";
  error: ApiRequestError | null;
  data: RecommendationResponse | null;
  reload: () => Promise<RecommendationResponse | null>;
  locationFeedback: LocationFeedback;
  requestCurrentLocation: () => void;
}

export function PlannerPage({ navigate, planner, setPlanner, ranked, selected, setSelectedId, status, error, data, reload, locationFeedback, requestCurrentLocation }: PlannerPageProps) {
  const recommendationView = status === "loading" || status === "idle"
    ? <RecommendationState status="loading" onRetry={() => void reload()} />
    : status === "error"
      ? <RecommendationState status="error" errorCode={error?.code} message={error?.message} onRetry={() => void reload()} />
      : selected
        ? <DestinationSpotlight destination={selected} items={ranked} navigate={navigate} onSelect={setSelectedId} />
        : <RecommendationState status="empty" message="현재 조건에서 추천할 수 있는 별보기 장소를 찾지 못했어요." onRetry={() => void reload()} />;

  return <AppPage path="/planner" navigate={navigate}>
    <main id="main-content" className="mx-auto w-[min(1280px,calc(100%-64px))] py-8 max-md:w-[calc(100%-32px)] max-md:py-6">
      <JourneyStepper current={1} />
      <PageHeading eyebrow="TONIGHT'S QUIET SKY" title="오늘 밤, 어디에서 별을 만날까요?" description="출발지와 시간을 알려주면 한적함, 이동 거리, 주변 체류지를 함께 비교해 드려요." />
      <div className="grid grid-cols-[minmax(320px,.82fr)_minmax(560px,1.7fr)] gap-6 max-lg:grid-cols-[350px_1fr] max-md:grid-cols-1">
        <PlannerForm planner={planner} setPlanner={setPlanner} status={status} locationFeedback={locationFeedback} requestCurrentLocation={requestCurrentLocation} reload={() => void reload()} />
        {recommendationView}
      </div>
      {data && <SourceNote sources={data.sources} generatedAt={data.generatedAt} />}
    </main>
  </AppPage>;
}
