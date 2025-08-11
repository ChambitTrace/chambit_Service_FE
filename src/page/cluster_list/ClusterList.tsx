import type React from "react"
import { useState } from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./ClusterListStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface Cluster {
  id: string
  name: string
  status: "healthy" | "error"
}

interface Node {
  id: string
  name: string
  status: "healthy" | "error"
  version: string
  age: string
}

const mockClusters: Cluster[] = [
  { id: "1", name: "production-cluster", status: "healthy" },
  { id: "2", name: "staging-cluster", status: "healthy" },
  { id: "3", name: "development-cluster", status: "error" },
  { id: "4", name: "testing-cluster", status: "healthy" },
  { id: "5", name: "backup-cluster", status: "error" },
]

const mockNodes: Record<string, Node[]> = {
  "1": [
    { id: "1-1", name: "prod-node-01", status: "healthy", version: "v1.28.2", age: "45d" },
    { id: "1-2", name: "prod-node-02", status: "healthy", version: "v1.28.2", age: "45d" },
    { id: "1-3", name: "prod-node-03", status: "healthy", version: "v1.28.2", age: "45d" },
    { id: "1-4", name: "prod-node-04", status: "error", version: "v1.28.1", age: "50d" },
  ],
  "2": [
    { id: "2-1", name: "stage-node-01", status: "healthy", version: "v1.28.2", age: "30d" },
    { id: "2-2", name: "stage-node-02", status: "healthy", version: "v1.28.2", age: "30d" },
  ],
  "3": [
    { id: "3-1", name: "dev-node-01", status: "error", version: "v1.27.8", age: "60d" },
    { id: "3-2", name: "dev-node-02", status: "healthy", version: "v1.28.0", age: "35d" },
    { id: "3-3", name: "dev-node-03", status: "error", version: "v1.27.8", age: "60d" },
  ],
  "4": [
    { id: "4-1", name: "test-node-01", status: "healthy", version: "v1.28.2", age: "20d" },
    { id: "4-2", name: "test-node-02", status: "healthy", version: "v1.28.2", age: "20d" },
  ],
  "5": [{ id: "5-1", name: "backup-node-01", status: "error", version: "v1.27.5", age: "90d" }],
}

const ClusterList: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("1")

  const layout = [
    { i: "cluster-list", x: 0, y: 0, w: 4, h: 7 },
    { i: "node-info", x: 4, y: 0, w: 8, h: 7 },
  ]

  const handleClusterSelect = (clusterId: string) => {
    setSelectedCluster(clusterId)
  }

  const selectedNodes = mockNodes[selectedCluster] || []
  const selectedClusterName = mockClusters.find((c) => c.id === selectedCluster)?.name || ""

  return (
    <div className="cluster-list-container">
      <Sidebar />
      <div className="cluster-main-content">
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

          <div key="node-info" className="card">
            <div className="card-title">Node check ({selectedClusterName} node 정보)</div>
            <div className="node-table">
              <div className="table-header">
                <div className="table-cell">Status</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Version</div>
                <div className="table-cell">AGE</div>
              </div>
              {selectedNodes.map((node) => (
                <div key={node.id} className="table-row">
                  <div className="table-cell">
                    <div className={`status-dot ${node.status}`}></div>
                  </div>
                  <div className="table-cell">{node.name}</div>
                  <div className="table-cell">{node.version}</div>
                  <div className="table-cell">{node.age}</div>
                </div>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default ClusterList
