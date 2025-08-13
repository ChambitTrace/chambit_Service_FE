import type React from "react"
import { useState } from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import Sidebar from "../sidebar/Sidebar"
import "./ManagementStyle.css"

const ReactGridLayout = WidthProvider(RGL)

interface SBOMFile {
  id: string
  date: string
  filename: string
  size: string
}

const latestSBOMs: SBOMFile[] = [
  { id: "1", date: "25.05.12", filename: "TestSBOM.json", size: "5MB" },
  { id: "2", date: "25.05.11", filename: "ProductionSBOM.json", size: "8MB" },
  { id: "3", date: "25.05.10", filename: "StagingSBOM.json", size: "6MB" },
]

const previousSBOMs: SBOMFile[] = [
  { id: "4", date: "25.04.12", filename: "OldSBOM.json", size: "5MB" },
  { id: "5", date: "25.04.05", filename: "LegacySBOM.json", size: "4MB" },
  { id: "6", date: "25.03.28", filename: "ArchiveSBOM.json", size: "7MB" },
]

const Management: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [filename, setFilename] = useState<string>("")

  const layout = [
    { i: "latest-sbom", x: 0, y: 0, w: 6, h: 4 },
    { i: "previous-sbom", x: 6, y: 0, w: 6, h: 7 },
    { i: "create-sbom", x: 0, y: 3, w: 6, h: 3 },
  ]

  const handleDownload = (filename: string) => {
    // Placeholder for download functionality
    console.log(`Downloading ${filename}`)
  }

  const handleCreate = () => {
    // Placeholder for create functionality
    console.log(`Creating SBOM: ${filename}.json on ${startDate} to ${endDate}`)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);

    if (endDate && new Date(value) > new Date(endDate)) {
      alert("시작 날짜는 종료 날짜보다 늦을 수 없습니다.");
      setStartDate(""); // 잘못된 값 초기화
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);

    if (startDate && new Date(startDate) > new Date(value)) {
      alert("종료 날짜는 시작 날짜보다 빠를 수 없습니다.");
      setEndDate(""); // 잘못된 값 초기화
    }
  };

  return (
    <div className="management-container">
      <Sidebar />
      <div className="management-main-content">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          isDraggable={false}
          isResizable={true}
        >
          <div key="latest-sbom" className="card">
            <div className="card-title">최신 SBOM</div>
            <div className="sbom-table">
              <div className="sbom-header">
                <div className="sbom-cell">생성날짜</div>
                <div className="sbom-cell">파일이름</div>
                <div className="sbom-cell">용량</div>
                <div className="sbom-cell">다운로드</div>
              </div>
              {latestSBOMs.map((sbom) => (
                <div key={sbom.id} className="sbom-row">
                  <div className="sbom-cell">{sbom.date}</div>
                  <div className="sbom-cell">{sbom.filename}</div>
                  <div className="sbom-cell">{sbom.size}</div>
                  <div className="sbom-cell">
                    <button className="download-button" onClick={() => handleDownload(sbom.filename)}>
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div key="previous-sbom" className="card">
            <div className="card-title">이전 생성했던 SBOM</div>
            <div className="sbom-table">
              <div className="sbom-header">
                <div className="sbom-cell">생성날짜</div>
                <div className="sbom-cell">파일이름</div>
                <div className="sbom-cell">용량</div>
                <div className="sbom-cell">다운로드</div>
              </div>
              {previousSBOMs.map((sbom) => (
                <div key={sbom.id} className="sbom-row">
                  <div className="sbom-cell">{sbom.date}</div>
                  <div className="sbom-cell">{sbom.filename}</div>
                  <div className="sbom-cell">{sbom.size}</div>
                  <div className="sbom-cell">
                    <button className="download-button" onClick={() => handleDownload(sbom.filename)}>
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div key="create-sbom" className="card">
            <div className="card-title">SBOM 생성하기</div>
            <div className="form">
              <div className="form-field">
                <label htmlFor="create-date">기간설정</label>
                <div className="date-range-group">
                  <div className="date-input">
                    <input
                      id="start-date"
                      type="date"
                      className="form-input"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="date-sep">~</div>
                  <div className="date-input">
                    <input
                      id="end-date"
                      type="date"
                      className="form-input"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="filename">파일이름</label>
                <div className="filename-input-wrapper">
                  <input
                    id="filename"
                    type="text"
                    className="form-input"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="파일이름을 입력하세요"
                  />
                  <span className="file-extension">.json</span>
                </div>
              </div>
              <button className="form-button" onClick={handleCreate} disabled={!startDate || !endDate || !filename}>
                생성하기
              </button>
            </div>
          </div>
        </ReactGridLayout>
      </div>
    </div>
  )
}

export default Management
