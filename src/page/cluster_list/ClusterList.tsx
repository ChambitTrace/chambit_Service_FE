function formatDate(value: number | string | undefined): string {
  if (!value) return "";
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (!num || isNaN(num)) return String(value);
  try {
    return new Date(num).toLocaleString();
  } catch {
    return String(value);
  }
}
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import Sidebar from "../sidebar/Sidebar";
import "./ClusterListStyle.css";
import { useClusters } from "../../hook/resource/getResource";
import { useNodes } from "../../hook/resource/getResource";

const ReactGridLayout = WidthProvider(RGL);

const ClusterList: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("");

  const { data: clusters, loading, error } = useClusters();
  const {
    data: nodes,
    loading: nodesLoading,
    error: nodesError,
  } = useNodes(selectedCluster);

  useEffect(() => {
    if (!selectedCluster && clusters.length > 0) {
      setSelectedCluster(clusters[0].id);
    }
  }, [clusters, selectedCluster]);

  const layout = [
    { i: "cluster-list", x: 0, y: 0, w: 4, h: 7 },
    { i: "node-info", x: 4, y: 0, w: 8, h: 7 },
  ];

  const handleClusterSelect = (clusterId: string) => {
    setSelectedCluster(clusterId);
  };

  const selectedNodes = nodes;
  const selectedClusterName = useMemo(() => {
    return clusters.find((c) => c.id === selectedCluster)?.name || "";
  }, [clusters, selectedCluster]);

  return (
    <div className="cluster-list-container">
      <Sidebar />
      <div className="cluster-main-content">
        {loading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">로딩 중...</div>
          </div>
        )}
        {error && !loading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">에러</div>
            <div style={{ padding: 12, color: "#c00" }}>{error}</div>
          </div>
        )}
        {nodesLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">노드 로딩 중...</div>
          </div>
        )}
        {nodesError && !nodesLoading && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">노드 에러</div>
            <div style={{ padding: 12, color: "#c00" }}>{nodesError}</div>
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
              {clusters.length === 0 && !loading && !error && (
                <div style={{ padding: 12, opacity: 0.7 }}>
                  표시할 클러스터가 없습니다.
                </div>
              )}
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

          <div key="node-info" className="card">
            <div className="card-title">Node check ({selectedClusterName})</div>
            <div className="node-table">
              <div className="table-header">
                <div className="table-cell">Status</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Version</div>
                <div className="table-cell">Create At</div>
              </div>
              {selectedNodes.map((node) => (
                <div key={node.id} className="table-row">
                  <div className="table-cell">
                    <div className={`status-dot ${node.status}`}></div>
                  </div>
                  <div className="table-cell">{node.name}</div>
                  <div className="table-cell">{node.version}</div>
                  <div className="table-cell">{formatDate(node.ca)}</div>
                </div>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default ClusterList;
