import Sidebar from '../sidebar/Sidebar.tsx'
import './DashboardStyle.css'

export default function Dashboard() {
  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).mozRequestFullScreen) { /* Firefox */
      (document.documentElement as any).mozRequestFullScreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      (document.documentElement as any).webkitRequestFullscreen();
    } else if ((document.documentElement as any).msRequestFullscreen) { /* IE/Edge */
      (document.documentElement as any).msRequestFullscreen();
    }
  };

  const cardsData = [
    {
      id: 1,
      title: '컨테이너 상태 추적과 자원조회',
      // description: '각 컨테이너 상태 및 사용 자원 표시',
      // data: '설명',
      className: 'card-1'
    },
    {
      id: 2,
      title: '정책위반 감지',
      // description: '어떤 Pod 에서 몇개의 정책이 위반되었는지',
      // data: '데이터: Pod ID와 정책 위반 개수',
    },
    {
      id: 3,
      title: 'Drift 감지',
      // description: '어떤 Pod 에서 추가, 변경이 됐는지',
      // data: '데이터: Pod ID와 Drift 개수',
    },
    {
      id: 4,
      title: 'SBOM 조회',
      // description: '마지막으로 생성된 SBOM 날짜 표시',
      // data: '데이터: 마지막에 생성된 SBOM 날짜',
    },
    {
      id: 5,
      title: 'CVE 리스트',
      // description: '심각도 별 모든 Pod 의 탐지된 CVE 개수 표시.',
      // data: '데이터: 각 Pod 의 심각도 별 개수',
    },
    {
      id: 6,
      title: '네트워크 모니터링',
      description: '', // No specific description in wireframe
      data: '', // No specific data in wireframe
      className: 'card-6'
    },
    {
      id: 7,
      title: 'CPU, 메모리 모니터링',
      description: '', // No specific description in wireframe
      data: '', // No specific data in wireframe
      className: 'card-7'
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        {/* <button className="fullscreen-btn" onClick={handleFullscreen}>전체화면</button> */}
        <section className="dashboard-cards-grid">
          {cardsData.map((card) => (
            <div key={card.id} className={`card ${card.className || ''}`}>
              <h2 className="card-title">{card.title}</h2>
              <div className="card-content">
                {card.description && <p>• 설명</p>}
                {card.description && <p>{card.description}</p>}
                {card.data && <p>• 데이터</p>}
                {card.data && <p>{card.data}</p>}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
