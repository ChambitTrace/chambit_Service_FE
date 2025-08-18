import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./page/login/LoginForm";
import Signup from "./page/login/Signup";
import NotFound from "./page/error/Error";
import TestPage from "./page/testhome/TestPage";
import Dashboard from "./page/dashboard/Dashboard";
import ClusterList from "./page/cluster_list/ClusterList";
import NamespaceList from "./page/namespace_list/NamespaceList";
import Status from "./page/status/Status";
import BuildUpload from "./page/build_upload/BuildUpload";
import Management from "./page/management/Management";
import CVEList from "./page/cvelist/CVEList";
import CVEDetail from "./page/cvelist/CVEListDetail";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<TestPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resource/cluster_list" element={<ClusterList />} />
        <Route path="/resource/namespace_list" element={<NamespaceList />} />
        <Route path="/resource/status" element={<Status />} />
        <Route path="/sbom/build_upload" element={<BuildUpload />} />
        <Route path="/sbom/management" element={<Management />} />
        <Route path="/policy/cve" element={<CVEList />} />
        <Route path="/policy/cve/:cveId" element={<CVEDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
