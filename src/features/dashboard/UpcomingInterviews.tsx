import { useMemo } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { useAppSelector } from '@/store/hooks'
import { formatDateTime, relativeFromNow } from '@/lib/utils'
import type { Interview } from '@/types'
import { TYPE_LABELS } from '@/features/interviews/constants'

export default function UpcomingInterviews({ items }: { items: Interview[] }) {
  const applications = useAppSelector((s) => s.applications.items)
  const titleById = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of applications) map.set(a.id, `${a.jobTitle} @ ${a.companyName}`)
    return map
  }, [applications])

  return (
    <Card>
      <CardHeader title="Upcoming Interviews" />
      <div className="p-2">
        {items.length === 0 ? (
          <EmptyState title="No upcoming interviews" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((interview) => (
              <li key={interview.id} className="px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {titleById.get(interview.applicationId) ?? 'Unknown role'}
                  </p>
                  <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                    {TYPE_LABELS[interview.type]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDateTime(interview.scheduledAt)} · {relativeFromNow(interview.scheduledAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
