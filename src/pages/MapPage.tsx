import { useState } from "react";
import { Drawer } from "vaul";
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
  const { planner, destination, route, location } = useApp();
  const [snap, setSnap] = useState<string | number | null>("210px");
  
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
        <MapCanvas destination={destination} embedUrl={embedUrl} />
      </main>

      {/* 모바일 화면 (전체 화면 지도 + Vaul 제스처 바텀시트) */}
      <div className="md:hidden relative h-[calc(100dvh-66px)] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapCanvas destination={destination} embedUrl={embedUrl} />
        </div>

        <Drawer.Root
          open={true}
          dismissible={false}
          modal={false}
          snapPoints={["210px", "470px", 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <Drawer.Portal>
            <Drawer.Content
              className="fixed inset-x-0 bottom-[66px] z-50 flex flex-col rounded-t-[22px] border-t border-cream/20 bg-[#091927] text-cream shadow-[0_-15px_45px_rgba(0,0,0,0.65)] outline-none"
              style={{ maxHeight: "calc(100dvh - 120px)" }}
            >
              <div className="mx-auto my-2.5 h-1.5 w-12 shrink-0 rounded-full bg-cream/30 cursor-grab active:cursor-grabbing hover:bg-cream/50" />
              <div className="overflow-y-auto px-5 pb-6">
                <RoutePanel
                  isMobileSheet
                  navigate={navigate}
                  planner={planner}
                  destination={destination}
                  route={route}
                  requestCurrentLocation={location.request}
                  locationFeedback={location.feedback}
                />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </AppPage>
  );
}
