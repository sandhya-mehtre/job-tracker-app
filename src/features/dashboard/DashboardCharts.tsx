import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader } from '@/components/ui/Card'
import { STATUS_COLORS } from '@/features/applications/constants'
import EmptyState from '@/components/ui/EmptyState'
import type { StatusDatum, TrendDatum } from './useDashboardData'

interface DashboardChartsProps {
  statusDistribution: StatusDatum[]
  trend: TrendDatum[]
}

export default function DashboardCharts({
  statusDistribution,
  trend,
}: DashboardChartsProps) {
  const hasStatusData = statusDistribution.length > 0
  const hasTrendData = trend.some((t) => t.count > 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader title="Applications Over Time" />
        <div className="h-72 p-4">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Applications"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No application activity yet" />
          )}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Status Breakdown" />
        <div className="h-72 p-4">
          {hasStatusData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusDistribution.map((d) => (
                    <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No applications to chart" />
          )}
        </div>
      </Card>
    </div>
  )
}
