import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { ACTIVE_STATUSES, STATUS_LABELS } from '@/features/applications/constants'
import type {
  Application,
  ApplicationStatus,
  Interview,
  ISODateString,
} from '@/types'

export interface DashboardStats {
  total: number
  active: number
  interviews: number
  offers: number
  upcomingInterviews: number
}

export interface StatusDatum {
  status: ApplicationStatus
  label: string
  count: number
}

export interface TrendDatum {
  /** Month label, e.g. "Mar". */
  month: string
  count: number
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  at: ISODateString
}

export interface DashboardData {
  stats: DashboardStats
  statusDistribution: StatusDatum[]
  trend: TrendDatum[]
  recentActivity: ActivityItem[]
  upcoming: Interview[]
}

const MONTH_FMT = new Intl.DateTimeFormat(undefined, { month: 'short' })

/** Build the last `count` months as {key, label} ending with the current month. */
function lastMonths(count: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_FMT.format(d) })
  }
  return out
}

/** Reads applications + interviews from the store and derives dashboard metrics. */
export function useDashboardData(): DashboardData {
  const applications = useAppSelector((s) => s.applications.items)
  const interviews = useAppSelector((s) => s.interviews.items)

  return useMemo(
    () => buildDashboardData(applications, interviews),
    [applications, interviews],
  )
}

function buildDashboardData(
  applications: Application[],
  interviews: Interview[],
): DashboardData {
  const now = Date.now()

  const stats: DashboardStats = {
    total: applications.length,
    active: applications.filter((a) => ACTIVE_STATUSES.includes(a.status)).length,
    interviews: applications.filter((a) => a.status === 'interview').length,
    offers: applications.filter(
      (a) => a.status === 'offer' || a.status === 'accepted',
    ).length,
    upcomingInterviews: interviews.filter(
      (i) => i.status === 'scheduled' && new Date(i.scheduledAt).getTime() >= now,
    ).length,
  }

  const counts = new Map<ApplicationStatus, number>()
  for (const app of applications) {
    counts.set(app.status, (counts.get(app.status) ?? 0) + 1)
  }
  const statusDistribution: StatusDatum[] = (
    Object.keys(STATUS_LABELS) as ApplicationStatus[]
  )
    .map((status) => ({ status, label: STATUS_LABELS[status], count: counts.get(status) ?? 0 }))
    .filter((d) => d.count > 0)

  const months = lastMonths(6)
  const trendMap = new Map(months.map((m) => [m.key, 0]))
  for (const app of applications) {
    if (!app.appliedDate) continue
    const d = new Date(app.appliedDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1)
  }
  const trend: TrendDatum[] = months.map((m) => ({
    month: m.label,
    count: trendMap.get(m.key) ?? 0,
  }))

  const recentActivity: ActivityItem[] = applications
    .map((a) => ({
      id: a.id,
      title: `${a.jobTitle} @ ${a.companyName}`,
      detail: STATUS_LABELS[a.status],
      at: a.updatedAt,
    }))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6)

  const upcoming = interviews
    .filter((i) => i.status === 'scheduled' && new Date(i.scheduledAt).getTime() >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5)

  return { stats, statusDistribution, trend, recentActivity, upcoming }
}
