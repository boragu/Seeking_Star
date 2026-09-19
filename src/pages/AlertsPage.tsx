import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { PageHeading } from "../components/ui/PageHeading";
import { AlertSettings } from "../features/alerts/components/AlertSettings";
import { useAlertPreferences } from "../features/alerts/useAlertPreferences";
import { AiAlertPreviewCard } from "../features/ai/components/AiAlertPreviewCard";

export function AlertsPage({ navigate }: { navigate: Navigate }) {
  const { destination, planner } = useApp();
  const preferences = useAlertPreferences(destination);
  return (
    <AppPage path="/alerts" navigate={navigate}>
      <main id="main-content" className="mx-auto w-[min(720px,calc(100%-64px))] py-10 max-md:w-[calc(100%-32px)] max-md:py-6">
        <PageHeading
          title="출발 전 혼잡도 알림 설정"
          description="선택한 관측지의 혼잡도 변동 상황을 출발 전 기기 알림으로 안내합니다."
        />
        <div className="mt-6 space-y-6">
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

          {/* AI 맞춤 출발 알림 미리보기 */}
          <AiAlertPreviewCard destination={destination} planner={planner} />
        </div>
      </main>
    </AppPage>
  );
}
