import type React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./BuildUploadStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface SBOMRecord {
  id: string
  uploadDate: string
  fileName: string
  fileSize: string
}

const mockSBOMRecords: SBOMRecord[] = [
  { id: "1", uploadDate: "2025.04.12", fileName: "SBOMtest.json", fileSize: "12MB" },
  { id: "2", uploadDate: "2025.04.10", fileName: "production-sbom.json", fileSize: "8.5MB" },
  { id: "3", uploadDate: "2025.04.08", fileName: "staging-sbom.json", fileSize: "6.2MB" },
  { id: "4", uploadDate: "2025.04.05", fileName: "dev-environment.json", fileSize: "4.1MB" },
  { id: "5", uploadDate: "2025.04.03", fileName: "test-sbom.json", fileSize: "3.8MB" },
  { id: "6", uploadDate: "2025.04.01", fileName: "backup-sbom.json", fileSize: "15.2MB" },
  { id: "7", uploadDate: "2025.03.12", fileName: "SBOMtest.json", fileSize: "12MB" },
  { id: "8", uploadDate: "2025.03.10", fileName: "production-sbom.json", fileSize: "8.5MB" },
  { id: "9", uploadDate: "2025.03.08", fileName: "staging-sbom.json", fileSize: "6.2MB" },
  { id: "10", uploadDate: "2025.03.05", fileName: "dev-environment.json", fileSize: "4.1MB" },
  { id: "11", uploadDate: "2025.03.03", fileName: "test-sbom.json", fileSize: "3.8MB" },
  { id: "12", uploadDate: "2025.03.01", fileName: "backup-sbom.json", fileSize: "15.2MB" },
  { id: "13", uploadDate: "2025.02.12", fileName: "SBOMtest.json", fileSize: "12MB" },
  { id: "14", uploadDate: "2025.02.10", fileName: "production-sbom.json", fileSize: "8.5MB" },
  { id: "15", uploadDate: "2025.02.08", fileName: "staging-sbom.json", fileSize: "6.2MB" },
  { id: "16", uploadDate: "2025.02.05", fileName: "dev-environment.json", fileSize: "4.1MB" },
  { id: "17", uploadDate: "2025.02.03", fileName: "test-sbom.json", fileSize: "3.8MB" },
  { id: "18", uploadDate: "2025.02.01", fileName: "backup-sbom.json", fileSize: "15.2MB" },
]

const BuildUpload: React.FC = () => {
  const layout = [
    { i: "file-upload", x: 0, y: 0, w: 12, h: 2 },
    { i: "sbom-records", x: 0, y: 2, w: 12, h: 5 },
  ]

  return (
    <div className="build-upload-container">
      <Sidebar />
      <div className="build-upload-main-content">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={false}
        >
          <div key="file-upload" className="card">
            <div className="card-title">File Upload</div>
            <div className="upload-area">
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  <p>Drag and drop your SBOM file here</p>
                  <p className="upload-subtext">or click to browse files</p>
                </div>
                <button className="upload-button">Choose File</button>
              </div>
            </div>
          </div>

          <div key="sbom-records" className="card">
            <div className="card-title">SBOM 업로드 기록</div>
            <div className="sbom-table">
              <div className="sbom-header">
                <div className="sbom-cell">업로드 날짜</div>
                <div className="sbom-cell">파일이름</div>
                <div className="sbom-cell">용량</div>
              </div>
              {mockSBOMRecords.map((record) => (
                <div key={record.id} className="sbom-row">
                  <div className="sbom-cell">{record.uploadDate}</div>
                  <div className="sbom-cell">{record.fileName}</div>
                  <div className="sbom-cell">{record.fileSize}</div>
                </div>
              ))}
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default BuildUpload
