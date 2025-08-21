import type React from "react";
import { useEffect, useMemo, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import Sidebar from "../sidebar/Sidebar";
import "./NamespaceListStyle.css";
import { useClusters, useNamespaces } from "../../hook/resource/getResource";

const ReactGridLayout = WidthProvider(RGL);

function formatDate(value: number | string | undefined): string {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (!num || isNaN(num)) return String(value);
  try {
    return new Date(num).toLocaleString();
  } catch {
    return String(value);
  }
}

const NamespaceList: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("");

  const {
    data: clusters,
    loading: clustersLoading,
    error: clustersError,
  } = useClusters();
  const {
    data: namespaces,
    loading: nsLoading,
    error: nsError,
  } = useNamespaces(selectedCluster);

  useEffect(() => {
    if (!selectedCluster && clusters.length > 0) {
      setSelectedCluster(clusters[0].id);
    }
  }, [clusters, selectedCluster]);

  const layout = [
    { i: "cluster-list", x: 0, y: 0, w: 4, h: 7 },
    { i: "namespace-list", x: 4, y: 0, w: 8, h: 7 },
  ];

  const handleClusterSelect = (clusterId: string) => {
    setSelectedCluster(clusterId);
  };

  const selectedNamespaces = namespaces;
  const selectedClusterName = useMemo(() => {
    return clusters.find((c) => c.id === selectedCluster)?.name || "";
  }, [clusters, selectedCluster]);

  return (
    <div className="namespace-list-container">
      <Sidebar />
      <div className="namespace-main-content">
        {clustersLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">클러스터 로딩 중...</div>
          </div>
        )}
        {clustersError && !clustersLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">클러스터 에러</div>
            <div style={{ padding: 12, color: "#c00" }}>{clustersError}</div>
          </div>
        )}
        {nsLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">네임스페이스 로딩 중...</div>
          </div>
        )}
        {nsError && !nsLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">네임스페이스 에러</div>
            <div style={{ padding: 12, color: "#c00" }}>{nsError}</div>
          </div>
        )}
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={true}
        >
          <div key="cluster-list" className="card">
            <div className="card-title">클러스터 목록</div>
            <div className="cluster-list">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className={`cluster-item ${
                    selectedCluster === cluster.id ? "active" : ""
                  }`}
                  onClick={() => handleClusterSelect(cluster.id)}
                >
                  <div className={`status-dot ${cluster.status}`}></div>
                  <span className="cluster-name">{cluster.name}</span>
                </div>
              ))}
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="status-dot healthy"></div>
                <span>정상</span>
              </div>
              <div className="legend-item">
                <div className="status-dot error"></div>
                <span>문제</span>
              </div>
            </div>
          </div>

          <div key="namespace-list" className="card">
            <div className="card-title">
              Namespace List ({selectedClusterName})
            </div>
            <div className="ns-table">
              <div className="ns-header">
                <div className="ns-cell">Status</div>
                <div className="ns-cell">Name</div>
                <div className="ns-cell">AGE</div>
              </div>
              {selectedNamespaces.map((namespace) => (
                <div key={namespace.id} className="ns-row">
                  <div className="ns-cell">
                    <div className={`status-dot ${namespace.status}`}></div>
                  </div>
                  <div className="ns-cell">{namespace.name}</div>
                  <div className="ns-cell">
                    {formatDate(namespace.age as string | number)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default NamespaceList;
