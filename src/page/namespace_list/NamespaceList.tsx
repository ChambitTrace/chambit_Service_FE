import type React from "react"
import { useState } from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./NamespaceListStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface Cluster {
  id: string
  name: string
  status: "healthy" | "error"
}

interface Namespace {
  id: string
  name: string
  status: "active" | "terminating"
  age: string
}

const mockClusters: Cluster[] = [
  { id: "1", name: "production-cluster", status: "healthy" },
  { id: "2", name: "staging-cluster", status: "healthy" },
  { id: "3", name: "development-cluster", status: "error" },
  { id: "4", name: "testing-cluster", status: "healthy" },
  { id: "5", name: "backup-cluster", status: "error" },
]

const mockNamespaces: Record<string, Namespace[]> = {
  "1": [
    { id: "1-1", name: "default", status: "active", age: "120d" },
    { id: "1-2", name: "kube-system", status: "active", age: "120d" },
    { id: "1-3", name: "production-app", status: "active", age: "45d" },
    { id: "1-4", name: "monitoring", status: "active", age: "30d" },
    { id: "1-5", name: "logging", status: "terminating", age: "25d" },
  ],
  "2": [
    { id: "2-1", name: "default", status: "active", age: "90d" },
    { id: "2-2", name: "kube-system", status: "active", age: "90d" },
    { id: "2-3", name: "staging-app", status: "active", age: "30d" },
    { id: "2-4", name: "testing", status: "active", age: "15d" },
  ],
  "3": [
    { id: "3-1", name: "default", status: "active", age: "60d" },
    { id: "3-2", name: "kube-system", status: "active", age: "60d" },
    { id: "3-3", name: "dev-app", status: "terminating", age: "20d" },
    { id: "3-4", name: "experimental", status: "active", age: "5d" },
  ],
  "4": [
    { id: "4-1", name: "default", status: "active", age: "40d" },
    { id: "4-2", name: "kube-system", status: "active", age: "40d" },
    { id: "4-3", name: "test-suite", status: "active", age: "10d" },
  ],
  "5": [
    { id: "5-1", name: "default", status: "active", age: "100d" },
    { id: "5-2", name: "backup-storage", status: "terminating", age: "80d" },
  ],
}

const NamespaceList: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("1")

  const layout = [
    { i: "cluster-list", x: 0, y: 0, w: 4, h: 7 },
    { i: "namespace-list", x: 4, y: 0, w: 8, h: 7 },
  ]

  const handleClusterSelect = (clusterId: string) => {
    setSelectedCluster(clusterId)
  }

  const selectedNamespaces = mockNamespaces[selectedCluster] || []
  const selectedClusterName = mockClusters.find((c) => c.id === selectedCluster)?.name || ""

  return (
    <div className="namespace-list-container">
      <Sidebar />
      <div className="namespace-main-content">
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
              {mockClusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className={`cluster-item ${selectedCluster === cluster.id ? "active" : ""}`}
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
            <div className="card-title">Namespace List ({selectedClusterName})</div>
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
                  <div className="ns-cell">{namespace.age}</div>
                </div>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default NamespaceList
