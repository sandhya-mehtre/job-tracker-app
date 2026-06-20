import PageHeader from '@/components/ui/PageHeader'
import { useDashboardData } from './useDashboardData'
import StatsCards from './StatsCards'
import DashboardCharts from './DashboardCharts'
import RecentActivities from './RecentActivities'
import UpcomingInterviews from './UpcomingInterviews'

/** Dashboard overview page (Tasks 11–15). */
export default function DashboardPage() {
  const { stats, statusDistribution, trend, recentActivity, upcoming } =
    useDashboardData()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your job search at a glance."
      />

      <div className="space-y-4">
        <StatsCards stats={stats} />
        <DashboardCharts statusDistribution={statusDistribution} trend={trend} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecentActivities items={recentActivity} />
          <UpcomingInterviews items={upcoming} />
        </div>
      </div>
    </div>
  )
}
