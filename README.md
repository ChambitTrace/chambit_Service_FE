# Chambit Frontend

Chambit은 Kubernetes 클러스터에서 실행 중인 컨테이너의 Runtime SBOM, SBOM Drift, CVE 매핑, 정책 위반 상태를 한눈에 확인하는 보안 관제 대시보드입니다.

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드 확인:

```bash
npm run build
```

## 주요 기술

- React
- TypeScript
- Vite
- styled-components
- lucide-react
- recharts
- React Router

## 주요 페이지

- Dashboard Overview: 전체 클러스터 수, 모니터링 Pod, Drift, Critical CVE 카드와 CVE severity, Drift 추세, 정책 위반 차트
- Cluster Status: 클러스터별 노드, Pod, Runtime SBOM 상태, Drift, Critical CVE, 정책 상태 테이블
- Runtime SBOM: Namespace, Pod, Container, Component 기준 런타임 SBOM 목록과 컴포넌트/Pod 검색
- Drift Detection: 빌드 타임 SBOM과 런타임 SBOM의 Added, Modified, Removed 차이와 위험도 표시
- CVE Mapping: 컴포넌트별 CVE, CVSS, severity, fixed version, 처리 상태 표시
- Policy Engine: CVSS, 라이센스, Runtime Drift, Critical CVE 정책과 Switch 기반 활성화 UI
- Alerts: Drift, CVE, Policy, Runtime 보안 이벤트 알림 큐

## 데이터 구조

현재 백엔드가 완성되지 않았기 때문에 `src/data/mockData.ts`의 mock data로 동작합니다. UI는 `src/data/securityRepository.ts`를 통해 데이터를 읽도록 분리되어 있어 이후 API 연동 시 repository 함수 내부를 교체하면 됩니다.

## 구현 메모

- 전역 상태관리 라이브러리는 사용하지 않았습니다.
- 검색과 정책 Switch는 `useState`, `useMemo` 기반의 로컬 상태로 처리합니다.
- Badge, Card, DataTable, Chart 컴포넌트는 재사용 가능하도록 분리했습니다.
