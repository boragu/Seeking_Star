import { ArrowRight } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { MapCanvas } from "../features/map/components/MapCanvas";
import { RoutePanel } from "../features/map/components/RoutePanel";
import { createMapEmbedUrl } from "../features/map/createMapEmbedUrl";

export function MapPage({ navigate }: { navigate: Navigate }) {
  const { planner, destination, route } = useApp();
  
  if (!destination) {
    return (
      <AppPage path="/map" navigate={navigate} tone="night">
        <EmptyState
          dark
          title="선택된 관측지가 없습니다"
          description="조건을 입력하고 추천 관측지를 선택하시면 지도에서 위치와 이동 경로를 확인하실 수 있습니다."
          action={
            <Button variant="night" onClick={() => navigate("/planner")}>
              관측지 탐색 <ArrowRight />
            </Button>
          }
        />
      </AppPage>
    );
  }
  const embedUrl = createMapEmbedUrl(destination, planner);
  return (
    <AppPage path="/map" navigate={navigate} tone="night">
      <div className="flex min-h-14 items-center bg-[#071521ee] px-6 max-md:hidden">
        <JourneyStepper current={2} dark />
      </div>
      <main
        id="main-content"
        className="grid h-[calc(100vh-132px)] min-h-[610px] grid-cols-[410px_1fr] max-lg:grid-cols-[365px_1fr] max-md:block max-md:h-[calc(100vh-66px)] max-md:min-h-[400px] max-md:relative"
      >
        <RoutePanel navigate={navigate} planner={planner} destination={destination} route={route} />
        <MapCanvas destination={destination} embedUrl={embedUrl} />
      </main>
    </AppPage>
  );
}
