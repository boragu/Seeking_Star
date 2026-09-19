import { ArrowRight } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { JourneyStepper } from "../components/layout/JourneyStepper";
import { BottomSheet } from "../components/ui/BottomSheet";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { MapCanvas } from "../features/map/components/MapCanvas";
import { RoutePanel } from "../features/map/components/RoutePanel";

export function MapPage({ navigate }: { navigate: Navigate }) {
  const { planner, destination, route, location } = useApp();
  
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

  return (
    <AppPage path="/map" navigate={navigate} tone="night" className="max-md:h-[100dvh] max-md:overflow-hidden max-md:pb-0">
      <div className="flex min-h-14 items-center bg-[#071521ee] px-6 max-md:hidden">
        <JourneyStepper current={2} dark />
      </div>

      {/* 데스크톱 화면 분할 뷰 */}
      <main
        id="main-content"
        className="hidden md:grid h-[calc(100vh-132px)] min-h-[610px] grid-cols-[410px_1fr] max-lg:grid-cols-[365px_1fr]"
      >
        <RoutePanel
          navigate={navigate}
          planner={planner}
          destination={destination}
          route={route}
          requestCurrentLocation={location.request}
          locationFeedback={location.feedback}
        />
        <MapCanvas destination={destination} planner={planner} route={route} />
      </main>

      {/* 모바일 화면 (전체 화면 지도 + 제스처 바텀시트) */}
      <div className="md:hidden relative h-[calc(100dvh-66px)] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapCanvas destination={destination} planner={planner} route={route} />
        </div>

        <BottomSheet snapPoints={[0.26, 0.62, 0.9]}>
          <RoutePanel
            isMobileSheet
            navigate={navigate}
            planner={planner}
            destination={destination}
            route={route}
            requestCurrentLocation={location.request}
            locationFeedback={location.feedback}
          />
        </BottomSheet>
      </div>
    </AppPage>
  );
}
