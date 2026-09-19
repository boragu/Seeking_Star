import { ArrowRight } from "@phosphor-icons/react";
import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
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
      {/* 통합 지도 및 경로 뷰 (데스크톱 2컬럼 / 모바일 전체화면 지도 + 바텀시트) */}
      <main
        id="main-content"
        className="relative h-[calc(100vh-76px)] min-h-[610px] w-full overflow-hidden max-md:h-[calc(100dvh-66px)] max-md:min-h-0 md:grid md:grid-cols-[410px_1fr] max-lg:md:grid-cols-[365px_1fr]"
      >
        {/* 데스크톱 사이드 패널 */}
        <div className="hidden h-full overflow-hidden md:block">
          <RoutePanel
            navigate={navigate}
            planner={planner}
            destination={destination}
            route={route}
            requestCurrentLocation={location.request}
            locationFeedback={location.feedback}
          />
        </div>

        {/* 단일 지도 캔버스 (데스크톱: 우측 컬럼 / 모바일: 전체 배경) */}
        <div className="size-full max-md:absolute max-md:inset-0 max-md:z-0">
          <MapCanvas destination={destination} planner={planner} route={route} />
        </div>

        {/* 모바일 하단 제스처 바텀시트 */}
        <div className="md:hidden">
          <BottomSheet snapPoints={[0.35, 0.65, 0.9]}>
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

        {/* 모바일 하단 플로팅 캡슐 버튼 */}
        <div className="fixed bottom-[calc(66px+14px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[60] md:hidden pointer-events-none w-max max-w-[calc(100vw-32px)]">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold-light/40 bg-gold px-5 py-2.5 text-[13px] font-bold text-[#241706] shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md transition duration-150 active:scale-95 hover:bg-gold-light"
          >
            <span>여정 확인 및 저장</span>
            <ArrowRight weight="bold" size={15} />
          </button>
        </div>
      </main>
    </AppPage>
  );
}
