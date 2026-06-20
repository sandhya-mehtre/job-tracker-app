import { Card, CardHeader } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { relativeFromNow } from '@/lib/utils'
import type { ActivityItem } from './useDashboardData'

export default function RecentActivities({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader title="Recent Activity" />
      <div className="p-2">
        {items.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-3 py-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {relativeFromNow(item.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
