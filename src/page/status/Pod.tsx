import type React from "react";
import { useEffect, useMemo, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import Sidebar from "../sidebar/Sidebar";
import "./PodStyle.css";
import {
  useClusters,
  useNamespaces,
  useNodes,
} from "../../hook/resource/getResource";
import { usePods } from "../../hook/resource/getPod";

const ReactGridLayout = WidthProvider(RGL);

const Status: React.FC = () => {
  type Mode = "namespace" | "node";
  const [mode, setMode] = useState<Mode>("namespace");
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedChildName, setSelectedChildName] = useState<string>(""); // namespace or node name
  const [selectedChildId, setSelectedChildId] = useState<string>(""); // ns id or node id

  const handleClusterClick = (clusterId: string) => {
    setSelectedCluster(clusterId);
    setSelectedChildName("");
    setSelectedChildId("");
  };

  const handleChildClick = (childName: string, childId: string) => {
    setSelectedChildName(childName);
    setSelectedChildId(childId);
  };

  // Data hooks
  const { data: clusters } = useClusters();
  const { data: namespaces } = useNamespaces(
    mode === "namespace" ? selectedCluster : undefined
  );
  const { data: nodes } = useNodes(
    mode === "node" ? selectedCluster : undefined
  );

  // Auto-select first cluster on load
  useEffect(() => {
    if (!selectedCluster && clusters && clusters.length > 0) {
      setSelectedCluster(clusters[0].id);
    }
  }, [clusters, selectedCluster]);

  const selectedClusterName = useMemo(
    () => clusters?.find((c) => c.id === selectedCluster)?.name ?? "",
    [clusters, selectedCluster]
  );

  const {
    data: pods,
    loading: podsLoading,
    error: podsError,
  } = usePods(mode === "node" ? selectedChildId : undefined);

  const layout = [
    { i: "tree", x: 0, y: 0, w: 5, h: 7 },
    { i: "podList", x: 5, y: 0, w: 7, h: 7 },
  ];

  return (
    <div className="status-container">
      <Sidebar />
      <div className="status-main-content">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={true}
        >
          <div key="tree" className="card">
            <h3 className="card-title">
              Cluster – {mode === "namespace" ? "Namespace" : "Node"} Tree
            </h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                className={mode === "namespace" ? "btn primary" : "btn"}
                onClick={() => setMode("namespace")}
              >
                Namespace 보기
              </button>
              <button
                className={mode === "node" ? "btn primary" : "btn"}
                onClick={() => setMode("node")}
              >
                Node 보기
              </button>
            </div>
            {mode === "namespace" && !namespaces && (
              <div style={{ padding: 8 }}>Loading namespaces…</div>
            )}
            {mode === "node" && !nodes && (
              <div style={{ padding: 8 }}>Loading nodes…</div>
            )}
            <div className="tree">
              {clusters?.map((cluster) => {
                const expanded = cluster.id === selectedCluster;
                const children: { id: string; name: string }[] = expanded
                  ? mode === "namespace"
                    ? (namespaces ?? []).map((ns) => ({
                        id: ns.id,
                        name: ns.name,
                      }))
                    : (nodes ?? []).map((nd) => ({ id: nd.id, name: nd.name }))
                  : [];

                return (
                  <div key={cluster.id} className="tree-cluster">
                    <div
                      className={`cluster-name ${expanded ? "active" : ""}`}
                      onClick={() => handleClusterClick(cluster.id)}
                    >
                      {cluster.name}
                    </div>
                    {expanded &&
                      children.map((child) => (
                        <div
                          key={`${cluster.id}-${child.id}`}
                          className={`tree-namespace ${
                            selectedChildId === child.id
                              ? "tree-item-active"
                              : ""
                          }`}
                          onClick={() => handleChildClick(child.name, child.id)}
                        >
                          {child.name}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div key="podList" className="card">
            <h3 className="card-title">
              Pod List{" "}
              {selectedClusterName && selectedChildName
                ? `(${selectedClusterName} – ${selectedChildName})`
                : ""}
            </h3>
            {podsLoading && <div style={{ padding: 8 }}>Loading pods…</div>}
            {podsError && !podsLoading && (
              <div style={{ padding: 8, color: "#c00" }}>
                Pod error: {podsError}
              </div>
            )}
            <div className="pod-table">
              <div className="pod-header">
                <div className="pod-cell">Ready</div>
                <div className="pod-cell">Name</div>
                <div className="pod-cell">Status</div>
              </div>
              {pods.map((pod, index) => (
                <div key={index} className="pod-row">
                  <div className="pod-cell">
                    <span className={`status-dot ${pod.status}`}></span>
                  </div>
                  <div className="pod-cell">{pod.name}</div>
                  <div className="pod-cell">{pod.status}</div>
                </div>
              ))}
              {pods.length === 0 &&
                selectedClusterName &&
                selectedChildName && (
                  <div className="pod-row">
                    <div
                      className="pod-cell"
                      style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No pods found
                    </div>
                  </div>
                )}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default Status;
