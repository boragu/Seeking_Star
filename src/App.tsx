import { useRoute } from "./app/navigation";
import { AppProvider } from "./app/AppContext";
import { AlertsPage } from "./pages/AlertsPage";
import { LandingPage } from "./pages/LandingPage";
import { MapPage } from "./pages/MapPage";
import { PlannerPage } from "./pages/PlannerPage";
import { TripsPage } from "./pages/TripsPage";

function AppRouter() {
  const [path, navigate] = useRoute();

  if (path === "/planner") return <PlannerPage navigate={navigate} />;
  if (path === "/map") return <MapPage navigate={navigate} />;
  if (path === "/trips") return <TripsPage navigate={navigate} />;
  if (path === "/alerts") return <AlertsPage navigate={navigate} />;
  return <LandingPage navigate={navigate} />;
}

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
