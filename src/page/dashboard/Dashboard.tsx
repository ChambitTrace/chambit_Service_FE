import RGL, { WidthProvider } from 'react-grid-layout';
import Sidebar from '../sidebar/Sidebar.tsx'
import './DashboardStyle.css'
const ReactGridLayout = WidthProvider(RGL);

export default function Dashboard() {

  const layout = [
    { i: "1", x: 0, y: 0, w: 4, h: 4 },
    { i: "2", x: 4, y: 0, w: 4, h: 4 },
    { i: "3", x: 8, y: 0, w: 4, h: 4 },
    { i: "4", x: 0, y: 2, w: 2, h: 4 },
    { i: "5", x: 2, y: 2, w: 3, h: 4 },
    { i: "6", x: 5, y: 2, w: 7, h: 2 },
    { i: "7", x: 5, y: 4, w: 7, h: 2 }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <ReactGridLayout
          className="layout"
          cols={12}
          rowHeight={100}
          layout={layout}
          isDraggable={true}
          isResizable={true}
        >
          <div key="1" className="card">
            <h2 className="card-title">컨테이너 상태 추적과 자원조회</h2>
            {/* <div className="card-content">
              <p>• 설명</p>
              <p>각 컨테이너 상태 및 사용자원 표시</p>
            </div> */}
          </div>

          <div key="2" className="card">
            <h2 className="card-title">정책위반 감지</h2>
            {/* <div className="card-content">
              <p>• 설명</p>
              <p>어떤 Pod 에서 몇개의 정책이 위반되었는지</p>
              <p>• 데이터</p>
              <p>Pod ID와 정책 위반 개수</p>
            </div> */}
          </div>

          <div key="3" className="card">
            <h2 className="card-title">Drift 감지</h2>
            {/* <div className="card-content">
              <p>• 설명</p>
              <p>어떤 Pod 에서 추가, 변경이 됐는지</p>
              <p>• 데이터</p>
              <p>Pod ID와 Drift 개수</p>
            </div> */}
          </div>

          <div key="4" className="card">
            <h2 className="card-title">SBOM 조회</h2>
            {/* <div className="card-content">
              <p>• 설명</p>
              <p>마지막으로 생성된 SBOM 날짜 표시</p>
              <p>• 데이터</p>
              <p>마지막에 생성된 SBOM 날짜</p>
            </div> */}
          </div>

          <div key="5" className="card">
            <h2 className="card-title">CVE 리스트</h2>
            {/* <div className="card-content">
              <p>• 설명</p>
              <p>심각도 별 모든 Pod 의 탐지된 CVE 개수 표시.</p>
              <p>• 데이터</p>
              <p>각 Pod 의 심각도 별 개수</p>
            </div> */}
          </div>

          <div key="6" className="card">
            <h2 className="card-title">네트워크 모니터링</h2>
          </div>

          <div key="7" className="card">
            <h2 className="card-title">CPU, 메모리 모니터링</h2>
          </div>
        </ReactGridLayout>
      </main>
    </div>
  );
}
