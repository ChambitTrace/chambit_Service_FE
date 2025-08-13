import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import { mockCVEs } from "./CVEList"
import "./CVEListDetailStyle.css"

const ReactGridLayout = WidthProvider(RGL)

const CVEDetail: React.FC = () => {
  const { cveId } = useParams<{ cveId: string }>()
  const navigate = useNavigate()

  const cve = mockCVEs.find((c) => c.cveId === cveId)

  if (!cve) {
    return (
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <div className="card" style={{ margin: "20px", height: "auto" }}>
            <h2>CVE Not Found</h2>
            <p>The requested CVE {cveId} was not found.</p>
            <button onClick={() => navigate("/policy/cve")} className="back-button">
              목록으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  const layout = [
    { i: "title-bar", x: 0, y: 0, w: 12, h: 1, maxH: 1 },
    { i: "left-column", x: 0, y: 1, w: 8, h: 6 },
    { i: "right-column", x: 8, y: 1, w: 4, h: 6 },
  ]

  const handleBackClick = () => {
    navigate("/policy/cve")
  }

  return (
    <div className="cve-detail-container">
      <Sidebar />
      <div className="cve-detail-main-content">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={true}
        >
          <div key="title-bar" className="card">
            <div className="actions">
              <div className="card-title">CVE Detail — {cve.cveId}</div>
              <button onClick={handleBackClick} className="back-button">
                목록으로
              </button>
            </div>
          </div>

          <div key="left-column" className="card">
            <div className="card-title">개요 (Overview)</div>
            <div className="overview-section">
              <p>{cve.description}</p>
            </div>

            <div className="card-title" style={{ marginTop: "24px" }}>
              영향받는 컴포넌트 (Affected)
            </div>
            <div className="affected-table">
              <div className="affected-header">
                <div className="affected-cell">Package</div>
                <div className="affected-cell">Version</div>
                <div className="affected-cell">Path</div>
              </div>
              {cve.affected.map((item, index) => (
                <div key={index} className="affected-row">
                  <div className="affected-cell">{item.package}</div>
                  <div className="affected-cell">{item.version}</div>
                  <div className="affected-cell">{item.path}</div>
                </div>
              ))}
            </div>

            <div className="card-title" style={{ marginTop: "24px" }}>
              완화/조치 (Remediation)
            </div>
            <div className="remediation-section">
              <p>{cve.remediation}</p>
            </div>
          </div>

          <div key="right-column" className="card">
            <div className="card-title">Severity</div>
            <div className="severity-section">
              <div className={`badge badge-${cve.severity.level.toLowerCase()}`}>{cve.severity.level}</div>
              <div className="score">CVSS {cve.severity.score}</div>
            </div>

            <div className="card-title" style={{ marginTop: "24px" }}>
              메타 정보
            </div>
            <div className="meta">
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Published:</span>
                  <span className="value">{cve.publishedAt}</span>
                </div>
                <div className="info-item">
                  <span className="label">Updated:</span>
                  <span className="value">{cve.updatedAt}</span>
                </div>
                <div className="info-item">
                  <span className="label">References:</span>
                  <span className="value">{cve.references.length}</span>
                </div>
              </div>
            </div>

            <div className="card-title" style={{ marginTop: "24px" }}>
              Tags/Type
            </div>
            <div className="tags-section">
              {cve.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* 출처 */}
            {/* <div className="card-title" style={{ marginTop: "24px" }}>
              References
            </div>
            <div className="refs">
              {cve.references.map((ref, index) => (
                <div key={index} className="ref-item">
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {ref.title}
                  </a>
                </div>
              ))}
            </div> */}
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default CVEDetail
