import { useRoute } from "./app/navigation";
import { useAppModel } from "./app/useAppModel";
import { AlertsPage } from "./pages/AlertsPage";
import { LandingPage } from "./pages/LandingPage";
import { MapPage } from "./pages/MapPage";
import { PlannerPage } from "./pages/PlannerPage";
import { TripsPage } from "./pages/TripsPage";

export function App() {
  const [path, navigate] = useRoute();
  const model = useAppModel(path);

  if (path === "/planner") return <PlannerPage navigate={navigate} planner={model.planner} setPlanner={model.setPlanner} ranked={model.ranked} selected={model.destination} setSelectedId={model.journey.setSelectedId} status={model.recommendations.status} error={model.recommendations.error} data={model.recommendations.data} reload={model.recommendations.reload} locationFeedback={model.location.feedback} requestCurrentLocation={model.location.request} />;
  if (path === "/map") return <MapPage navigate={navigate} planner={model.planner} destination={model.destination} route={model.route} />;
  if (path === "/trips") return <TripsPage navigate={navigate} planner={model.planner} destination={model.destination} route={model.route} saved={model.journey.saved} setSaved={model.journey.setSaved} />;
  if (path === "/alerts") return <AlertsPage navigate={navigate} destination={model.destination} />;
  return <LandingPage navigate={navigate} planner={model.planner} />;
}
