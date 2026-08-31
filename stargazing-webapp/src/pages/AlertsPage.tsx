import type { Navigate } from "../app/navigation";
import { AppPage } from "../components/layout/AppPage";
import { PageHeading } from "../components/ui/PageHeading";
import type { Destination } from "../domain/types";
import { AlertPreview } from "../features/alerts/components/AlertPreview";
import { AlertSettings } from "../features/alerts/components/AlertSettings";
import { useAlertPreferences } from "../features/alerts/useAlertPreferences";

export function AlertsPage({ navigate, destination }: { navigate: Navigate; destination: Destination | null }) {
  const preferences = useAlertPreferences();
  return <AppPage path="/alerts" navigate={navigate}>
    <main id="main-content" className="mx-auto w-[min(1080px,calc(100%-64px))] py-10 max-md:w-[calc(100%-32px)] max-md:py-6">
      <PageHeading eyebrow="BEFORE DEPARTURE" title="출발 전에 한 번 더 알려드릴게요." description="선택한 장소의 예상 혼잡도가 달라지면, 출발 전에 현재 기기에서 확인할 수 있어요." />
      <div className="grid grid-cols-[1.2fr_.88fr] gap-6 max-md:grid-cols-1"><AlertSettings destination={destination} enabled={preferences.enabled} setEnabled={preferences.setEnabled} timing={preferences.timing} setTiming={preferences.setTiming} /><AlertPreview destination={destination} timing={preferences.timing} permission={preferences.permission} saved={preferences.saved} save={preferences.save} /></div>
    </main>
  </AppPage>;
}
