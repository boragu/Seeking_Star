import type { Navigate } from "../app/navigation";
import { useApp } from "../app/AppContext";
import { AppPage } from "../components/layout/AppPage";
import { PageHeading } from "../components/ui/PageHeading";
import { AlertPreview } from "../features/alerts/components/AlertPreview";
import { AlertSettings } from "../features/alerts/components/AlertSettings";
import { useAlertPreferences } from "../features/alerts/useAlertPreferences";

export function AlertsPage({ navigate }: { navigate: Navigate }) {
  const { destination } = useApp();
  const preferences = useAlertPreferences();
  return (
    <AppPage path="/alerts" navigate={navigate}>
      <main id="main-content" className="mx-auto w-[min(1080px,calc(100%-64px))] py-10 max-md:w-[calc(100%-32px)] max-md:py-6">
        <PageHeading
          title="출발 전 혼잡도 알림 설정"
          description="선택한 관측지의 혼잡도 변동 상황을 출발 전 기기 알림으로 안내합니다."
        />
        <div className="grid grid-cols-[1.2fr_.88fr] gap-6 max-md:grid-cols-1">
          <AlertSettings
            destination={destination}
            enabled={preferences.enabled}
            setEnabled={preferences.setEnabled}
            timing={preferences.timing}
            setTiming={preferences.setTiming}
          />
          <AlertPreview
            destination={destination}
            timing={preferences.timing}
            permission={preferences.permission}
            saved={preferences.saved}
            testSent={preferences.testSent}
            save={() => preferences.save(destination)}
            triggerTestAlert={() => preferences.triggerTestAlert(destination)}
          />
        </div>
      </main>
    </AppPage>
  );
}
