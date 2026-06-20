import type {
  InterviewOutcome,
  InterviewStatus,
  InterviewType,
} from '@/types'

export const TYPE_LABELS: Record<InterviewType, string> = {
  'phone-screen': 'Phone Screen',
  technical: 'Technical',
  behavioral: 'Behavioral',
  'system-design': 'System Design',
  onsite: 'On-site',
  hr: 'HR',
  final: 'Final',
}

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
}

export const OUTCOME_LABELS: Record<InterviewOutcome, string> = {
  pending: 'Pending',
  passed: 'Passed',
  failed: 'Failed',
}

export const INTERVIEW_STATUS_BADGE_CLASSES: Record<InterviewStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  completed:
    'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  rescheduled:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
}

/** Duration options (minutes) offered by the scheduler form. */
export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120].map((m) => ({
  value: String(m),
  label: `${m} min`,
}))
