import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled, { useTheme } from "styled-components";
import type { DriftTrendPoint, PolicyRatioPoint, SeverityPoint } from "../../types/security";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "../Card";

interface ChartProps<T> {
  data: T[];
}

export function SeverityBarChart({ data }: ChartProps<SeverityPoint>) {
  const theme = useTheme();
  const colors = [theme.colors.critical, theme.colors.high, theme.colors.medium, theme.colors.low];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Severity별 CVE 개수</CardTitle>
          <CardSubtitle>실행 중인 컨테이너 컴포넌트 기준</CardSubtitle>
        </div>
      </CardHeader>
      <ChartBody>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid stroke={theme.colors.border} vertical={false} />
            <XAxis dataKey="severity" stroke={theme.colors.muted} tickLine={false} axisLine={false} />
            <YAxis stroke={theme.colors.muted} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.severity} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBody>
    </Card>
  );
}

export function DriftLineChart({ data }: ChartProps<DriftTrendPoint>) {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>최근 Drift 이벤트</CardTitle>
          <CardSubtitle>최근 7일 감지 추세</CardSubtitle>
        </div>
      </CardHeader>
      <ChartBody>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke={theme.colors.border} vertical={false} />
            <XAxis dataKey="day" stroke={theme.colors.muted} tickLine={false} axisLine={false} />
            <YAxis stroke={theme.colors.muted} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
            <Line type="monotone" dataKey="count" stroke={theme.colors.accent} strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBody>
    </Card>
  );
}

export function PolicyPieChart({ data }: ChartProps<PolicyRatioPoint>) {
  const theme = useTheme();
  const colors = [theme.colors.success, theme.colors.warning, theme.colors.danger];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>정책 위반 비율</CardTitle>
          <CardSubtitle>정책 평가 결과 분포</CardSubtitle>
        </div>
      </CardHeader>
      <ChartBody>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartBody>
    </Card>
  );
}

const ChartBody = styled(CardBody)`
  height: 19rem;
`;
