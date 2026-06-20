import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { SOURCE_LABELS } from '@/features/applications/constants'
import { OUTCOME_LABELS } from '@/features/interviews/constants'
import type {
  Application,
  ApplicationSource,
  Interview,
  InterviewOutcome,
} from '@/types'

export interface NamedCount {
  name: string
  value: number
}

export interface MonthlyDatum {
  month: string
  count: number
}

export interface AnalyticsData {
  kpis: {
    total: number
    responseRate: number // % of applications that moved past "applied"
    interviewRate: number // % that reached interview or beyond
    offerRate: number // % that reached offer or beyond
  }
  monthlyApplications: MonthlyDatum[]
  interviewOutcomes: NamedCount[]
  offerRatio: NamedCount[]
  bySource: NamedCount[]
}

const MONTH_FMT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  year: '2-digit',
})

/** Pipeline rank used to decide how far an application progressed. */
const STATUS_RANK: Record<Application['status'], number> = {
  wishlist: 0,
  applied: 1,
  screening: 2,
  interview: 3,
  offer: 4,
  accepted: 5,
  rejected: 1, // reached at least "applied"; exact drop-off point is unknown
}

function lastMonths(count: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_FMT.format(d) })
  }
  return out
}

function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100)
}

export function useAnalyticsData(): AnalyticsData {
  const applications = useAppSelector((s) => s.applications.items)
  const interviews = useAppSelector((s) => s.interviews.items)

  return useMemo(
    () => buildAnalytics(applications, interviews),
    [applications, interviews],
  )
}

function buildAnalytics(
  applications: Application[],
  interviews: Interview[],
): AnalyticsData {
  const total = applications.length

  // Applications that actually entered the pipeline (excludes wishlist).
  const submitted = applications.filter((a) => STATUS_RANK[a.status] >= 1).length
  const respondedOrBeyond = applications.filter(
    (a) => STATUS_RANK[a.status] >= 2,
  ).length
  const interviewedOrBeyond = applications.filter(
    (a) => STATUS_RANK[a.status] >= 3,
  ).length
  const offerOrBeyond = applications.filter(
    (a) => STATUS_RANK[a.status] >= 4,
  ).length

  const kpis = {
    total,
    responseRate: pct(respondedOrBeyond, submitted),
    interviewRate: pct(interviewedOrBeyond, submitted),
    offerRate: pct(offerOrBeyond, submitted),
  }

  // Monthly applications (last 12 months) by applied date, falling back to created.
  const months = lastMonths(12)
  const monthMap = new Map(months.map((m) => [m.key, 0]))
  for (const app of applications) {
    const stamp = app.appliedDate ?? app.createdAt
    const d = new Date(stamp)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (monthMap.has(key)) monthMap.set(key, (monthMap.get(key) ?? 0) + 1)
  }
  const monthlyApplications: MonthlyDatum[] = months.map((m) => ({
    month: m.label,
    count: monthMap.get(m.key) ?? 0,
  }))

  // Interview outcomes.
  const outcomeCounts = new Map<InterviewOutcome, number>()
  for (const i of interviews) {
    outcomeCounts.set(i.outcome, (outcomeCounts.get(i.outcome) ?? 0) + 1)
  }
  const interviewOutcomes: NamedCount[] = (
    Object.keys(OUTCOME_LABELS) as InterviewOutcome[]
  )
    .map((o) => ({ name: OUTCOME_LABELS[o], value: outcomeCounts.get(o) ?? 0 }))
    .filter((d) => d.value > 0)

  // Offer ratio (offers/accepted vs the rest of submitted applications).
  const offerRatio: NamedCount[] = [
    { name: 'Offers', value: offerOrBeyond },
    { name: 'No offer', value: Math.max(submitted - offerOrBeyond, 0) },
  ].filter((d) => d.value > 0)

  // Applications by source.
  const sourceCounts = new Map<ApplicationSource, number>()
  for (const app of applications) {
    sourceCounts.set(app.source, (sourceCounts.get(app.source) ?? 0) + 1)
  }
  const bySource: NamedCount[] = (Object.keys(SOURCE_LABELS) as ApplicationSource[])
    .map((s) => ({ name: SOURCE_LABELS[s], value: sourceCounts.get(s) ?? 0 }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  return { kpis, monthlyApplications, interviewOutcomes, offerRatio, bySource }
}
