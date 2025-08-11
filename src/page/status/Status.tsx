import type React from "react"
import { useState } from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./StatusStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface Pod {
  name: string
  status: "running" | "pending" | "failed"
  ready: boolean
}

interface MockData {
  [cluster: string]: {
    [namespace: string]: Pod[]
  }
}

const mockData: MockData = {
  "Cluster 1": {
    "kube-system": [
      { name: "coredns-558bd4d5db-abc12", status: "running", ready: true },
      { name: "etcd-master-node", status: "running", ready: true },
      { name: "kube-apiserver-master", status: "pending", ready: false },
    ],
    "kube-public": [
      { name: "cluster-info-configmap", status: "running", ready: true },
      { name: "public-service-pod", status: "failed", ready: false },
    ],
  },
  "Cluster 2": {
    "kube-node-lease": [
      { name: "node-lease-controller", status: "running", ready: true },
      { name: "lease-manager-pod", status: "running", ready: true },
      { name: "node-heartbeat-pod", status: "pending", ready: false },
    ],
  },
  "Cluster 3": {
    dev: [
      { name: "frontend-app-xyz", status: "running", ready: true },
      { name: "backend-api-abc", status: "failed", ready: false },
      { name: "database-pod-def", status: "running", ready: true },
    ],
  },
}

const Status: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>("")
  const [selectedNamespace, setSelectedNamespace] = useState<string>("")

  const handleNamespaceClick = (cluster: string, namespace: string) => {
    setSelectedCluster(cluster)
    setSelectedNamespace(namespace)
  }

  const getPods = (): Pod[] => {
    if (selectedCluster && selectedNamespace && mockData[selectedCluster]) {
      return mockData[selectedCluster][selectedNamespace] || []
    }
    return []
  }

  const layout = [
    { i: "tree", x: 0, y: 0, w: 5, h: 7 },
    { i: "podList", x: 5, y: 0, w: 7, h: 7 },
  ]

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
            <h3 className="card-title">Cluster – Namespace Tree</h3>
            <div className="tree">
              {Object.entries(mockData).map(([cluster, namespaces]) => (
                <div key={cluster} className="tree-cluster">
                  <div className="cluster-name">{cluster}</div>
                  {Object.keys(namespaces).map((namespace) => (
                    <div
                      key={`${cluster}-${namespace}`}
                      className={`tree-namespace ${
                        selectedCluster === cluster && selectedNamespace === namespace ? "tree-item-active" : ""
                      }`}
                      onClick={() => handleNamespaceClick(cluster, namespace)}
                    >
                      {namespace}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div key="podList" className="card">
            <h3 className="card-title">
              Pod List {selectedCluster && selectedNamespace && `(${selectedCluster} – ${selectedNamespace})`}
            </h3>
            <div className="pod-table">
              <div className="pod-header">
                <div className="pod-cell">Ready</div>
                <div className="pod-cell">Name</div>
                <div className="pod-cell">Status</div>
              </div>
              {getPods().map((pod, index) => (
                <div key={index} className="pod-row">
                  <div className="pod-cell">
                    <span className={`status-dot ${pod.status}`}></span>
                  </div>
                  <div className="pod-cell">{pod.name}</div>
                  <div className="pod-cell">{pod.status}</div>
                </div>
              ))}
              {getPods().length === 0 && selectedCluster && selectedNamespace && (
                <div className="pod-row">
                  <div className="pod-cell" style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
                    No pods found
                  </div>
                </div>
              )}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default Status
