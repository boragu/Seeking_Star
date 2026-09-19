import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { PageHeading } from "../components/ui/PageHeading";
import { Skeleton } from "../components/ui/Skeleton";
import { AlertSettings } from "../features/alerts/components/AlertSettings";
import { useAlertPreferences } from "../features/alerts/useAlertPreferences";
import { AiAlertPreviewCard } from "../features/ai/components/AiAlertPreviewCard";

export function AlertsPage({ navigate }: { navigate: Navigate }) {
  const { destination, planner, recommendations: { status } } = useApp();
  const preferences = useAlertPreferences(destination);

  return (
    <AppPage path="/alerts" navigate={navigate}>
      <main id="main-content" className="mx-auto w-[min(720px,calc(100%-64px))] py-10 max-md:w-[calc(100%-32px)] max-md:py-6">
        <PageHeading
          title="출발 전 혼잡도 알림 설정"
          description="선택한 관측지의 혼잡도 변동 상황을 출발 전 기기 알림으로 안내합니다."
        />
        <div className="mt-6 space-y-6">
          {status === "loading" ? (
            <div className="border border-line bg-white/48 p-7 shadow-xs space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="space-y-3 pt-2">
                <Skeleton className="h-5 w-28" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-11 w-full rounded" />
                  <Skeleton className="h-11 w-full rounded" />
                  <Skeleton className="h-11 w-full rounded" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-line">
                <Skeleton className="h-11 flex-1 rounded-lg" />
                <Skeleton className="h-11 flex-1 rounded-lg" />
              </div>
            </div>
          ) : (
            <AlertSettings
              destination={destination}
              enabled={preferences.enabled}
              setEnabled={preferences.setEnabled}
              timing={preferences.timing}
              setTiming={preferences.setTiming}
              permission={preferences.permission}
              requestPermission={preferences.requestPermission}
              saved={preferences.saved}
              testSent={preferences.testSent}
              save={() => preferences.save(destination)}
              triggerTestAlert={() => preferences.triggerTestAlert(destination, planner.departure)}
            />
          )}

          {/* AI 맞춤 출발 알림 미리보기 */}
          <AiAlertPreviewCard destination={destination} planner={planner} />
        </div>
      </main>
    </AppPage>
  );
}

