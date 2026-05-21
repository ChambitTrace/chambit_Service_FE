import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { AlertsPage } from "./pages/AlertsPage";
import { ClusterStatusPage } from "./pages/ClusterStatusPage";
import { CveMappingPage } from "./pages/CveMappingPage";
import { DashboardOverview } from "./pages/DashboardOverview";
import { DriftDetectionPage } from "./pages/DriftDetectionPage";
import { KubernetesAssetNavigatorPage } from "./pages/KubernetesAssetNavigatorPage";
import { PolicyEnginePage } from "./pages/PolicyEnginePage";
import { RuntimeSbomPage } from "./pages/RuntimeSbomPage";
import "./index.css";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/clusters" element={<ClusterStatusPage />} />
        <Route path="/kubernetes-assets" element={<KubernetesAssetNavigatorPage />} />
        <Route path="/runtime-sbom" element={<RuntimeSbomPage />} />
        <Route path="/drift" element={<DriftDetectionPage />} />
        <Route path="/cves" element={<CveMappingPage />} />
        <Route path="/policies" element={<PolicyEnginePage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
