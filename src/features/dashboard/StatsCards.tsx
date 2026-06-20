import { Card } from '@/components/ui/Card'
import {
  ApplicationsIcon,
  InterviewsIcon,
  AnalyticsIcon,
} from '@/components/ui/icons'
import type { ComponentType, SVGProps } from 'react'
import type { DashboardStats } from './useDashboardData'

interface StatConfig {
  key: keyof DashboardStats
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  accent: string
}

const STAT_CONFIGS: StatConfig[] = [
  {
    key: 'total',
    label: 'Total Applications',
    icon: ApplicationsIcon,
    accent: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
  },
  {
    key: 'active',
    label: 'Active Pipeline',
    icon: AnalyticsIcon,
    accent: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
  },
  {
    key: 'upcomingInterviews',
    label: 'Upcoming Interviews',
    icon: InterviewsIcon,
    accent: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300',
  },
  {
    key: 'offers',
    label: 'Offers',
    icon: ApplicationsIcon,
    accent: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  },
]

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CONFIGS.map(({ key, label, icon: Icon, accent }) => (
        <Card key={key} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {stats[key]}
              </p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-6 w-6" />
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
