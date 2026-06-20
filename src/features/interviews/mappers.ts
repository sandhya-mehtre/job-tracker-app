import type { Interview } from '@/types'
import type { InterviewInput } from './interviewsSlice'
import type { InterviewFormValues } from './interviewSchema'

const pad = (n: number): string => String(n).padStart(2, '0')

/** ISO date-time → `YYYY-MM-DDTHH:mm` in local time for a datetime-local input. */
export function isoToLocalInput(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

/** `YYYY-MM-DDTHH:mm` (local) → ISO date-time string. */
function localInputToIso(local: string): string {
  return new Date(local).toISOString()
}

export function toFormValues(interview: Interview): InterviewFormValues {
  return {
    applicationId: interview.applicationId,
    type: interview.type,
    status: interview.status,
    outcome: interview.outcome,
    scheduledAt: isoToLocalInput(interview.scheduledAt),
    durationMinutes: String(interview.durationMinutes),
    location: interview.location,
    interviewerNames: interview.interviewerNames,
    notes: interview.notes,
  }
}

export function toInterviewInput(values: InterviewFormValues): InterviewInput {
  return {
    applicationId: values.applicationId,
    type: values.type,
    status: values.status,
    outcome: values.outcome,
    scheduledAt: localInputToIso(values.scheduledAt),
    durationMinutes: Number(values.durationMinutes),
    location: values.location,
    interviewerNames: values.interviewerNames,
    notes: values.notes,
  }
}
