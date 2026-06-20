import type {
  ApplicationSource,
  ApplicationStatus,
  JobType,
  WorkMode,
} from '@/types'

/** Human-readable labels for each application status. */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  accepted: 'Accepted',
}

/** Hex colors for charts (Recharts needs raw colors, not Tailwind classes). */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: '#94a3b8',
  applied: '#3b82f6',
  screening: '#06b6d4',
  interview: '#a855f7',
  offer: '#f59e0b',
  rejected: '#ef4444',
  accepted: '#22c55e',
}

/** Tailwind badge classes per status (light + dark). */
export const STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  wishlist:
    'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  screening: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  interview:
    'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  offer: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  accepted:
    'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
}

/** Statuses considered "active" (still in the pipeline). */
export const ACTIVE_STATUSES: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'offer',
]

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
}

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
}

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  referral: 'Referral',
  'company-website': 'Company Website',
  recruiter: 'Recruiter',
  'job-board': 'Job Board',
  other: 'Other',
}

/** Turn a `{ value: label }` record into `<select>` options. */
export function toOptions<T extends string>(
  labels: Record<T, string>,
): { value: T; label: string }[] {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }))
}
