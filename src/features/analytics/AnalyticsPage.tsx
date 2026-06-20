import type { ReactElement, ReactNode } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { useAnalyticsData, type NamedCount } from './useAnalyticsData'

const OUTCOME_COLORS: Record<string, string> = {
  Passed: '#22c55e',
  Failed: '#ef4444',
  Pending: '#f59e0b',
}
const OFFER_COLORS: Record<string, string> = {
  Offers: '#22c55e',
  'No offer': '#cbd5e1',
}
const SOURCE_BAR = '#6366f1'

/** Card wrapper with a fixed-height chart body and an empty fallback. */
function ChartCard({
  title,
  hasData,
  children,
  className,
}: {
  title: string
  hasData: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} />
      <div className="h-72 p-4">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            {children as ReactElement}
          </ResponsiveContainer>
        ) : (
          <EmptyState title="Not enough data yet" />
        )}
      </div>
    </Card>
  )
}

function Donut({
  data,
  colors,
}: {
  data: NamedCount[]
  colors: Record<string, string>
}) {
  return (
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
        {data.map((d) => (
          <Cell key={d.name} fill={colors[d.name] ?? '#94a3b8'} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  )
}

export default function AnalyticsPage() {
  const { kpis, monthlyApplications, interviewOutcomes, offerRatio, bySource } =
    useAnalyticsData()

  const kpiCards = [
    { label: 'Total Applications', value: kpis.total },
    { label: 'Response Rate', value: `${kpis.responseRate}%` },
    { label: 'Interview Rate', value: `${kpis.interviewRate}%` },
    { label: 'Offer Rate', value: `${kpis.offerRate}%` },
  ]

  const hasMonthly = monthlyApplications.some((m) => m.count > 0)

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Insights across your job search funnel."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <Card key={k.label} className="p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">{k.label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{k.value}</p>
            </Card>
          ))}
        </div>

        <ChartCard title="Applications Per Month" hasData={hasMonthly}>
          <BarChart data={monthlyApplications} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
            <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="count" name="Applications" fill={SOURCE_BAR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Interview Conversion" hasData={interviewOutcomes.length > 0}>
            <Donut data={interviewOutcomes} colors={OUTCOME_COLORS} />
          </ChartCard>

          <ChartCard title="Offer Ratio" hasData={offerRatio.length > 0}>
            <Donut data={offerRatio} colors={OFFER_COLORS} />
          </ChartCard>
        </div>

        <ChartCard title="Applications by Source" hasData={bySource.length > 0}>
          <BarChart
            data={bySource}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 24, bottom: 4 }}
          >
            <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={110}
            />
            <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="value" name="Applications" fill={SOURCE_BAR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  )
}
