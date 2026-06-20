import { Card } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { cn, formatDateTime } from '@/lib/utils'
import type { Interview } from '@/types'
import {
  INTERVIEW_STATUS_BADGE_CLASSES,
  INTERVIEW_STATUS_LABELS,
  TYPE_LABELS,
} from './constants'

interface InterviewTimelineProps {
  interviews: Interview[]
  titleFor: (applicationId: string) => string
  onEdit: (interview: Interview) => void
}

/** Vertical chronological timeline of interviews (most recent first). */
export default function InterviewTimeline({
  interviews,
  titleFor,
  onEdit,
}: InterviewTimelineProps) {
  if (interviews.length === 0) {
    return (
      <Card className="p-10">
        <EmptyState title="No interviews to show" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <ol className="relative ml-3 border-l border-slate-200 dark:border-slate-700">
        {interviews.map((interview) => (
          <li key={interview.id} className="mb-6 ml-6 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-500 dark:border-slate-900" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {TYPE_LABELS[interview.type]}
              </p>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  INTERVIEW_STATUS_BADGE_CLASSES[interview.status],
                )}
              >
                {INTERVIEW_STATUS_LABELS[interview.status]}
              </span>
              <button
                type="button"
                onClick={() => onEdit(interview)}
                className="ml-auto text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300"
              >
                Edit
              </button>
            </div>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
              {titleFor(interview.applicationId)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {formatDateTime(interview.scheduledAt)} · {interview.durationMinutes} min
              {interview.location && ` · ${interview.location}`}
            </p>
            {interview.notes && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {interview.notes}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Card>
  )
}
