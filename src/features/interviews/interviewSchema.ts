import { z } from 'zod'
import {
  INTERVIEW_OUTCOMES,
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
} from '@/types'

/**
 * Scheduler form schema. All values are strings (HTML inputs); `scheduledAt`
 * is a `datetime-local` value and `durationMinutes` comes from a select.
 * `toInterviewInput` converts these to the persisted `Interview` shape.
 */
export const interviewFormSchema = z.object({
  applicationId: z.string().min(1, 'Select an application'),
  type: z.enum(INTERVIEW_TYPES),
  status: z.enum(INTERVIEW_STATUSES),
  outcome: z.enum(INTERVIEW_OUTCOMES),
  scheduledAt: z.string().min(1, 'Pick a date and time'),
  durationMinutes: z.string(),
  location: z.string().trim().max(120),
  interviewerNames: z.string().trim().max(160),
  notes: z.string().trim().max(2000),
})

export type InterviewFormValues = z.infer<typeof interviewFormSchema>

export const emptyInterviewForm: InterviewFormValues = {
  applicationId: '',
  type: 'phone-screen',
  status: 'scheduled',
  outcome: 'pending',
  scheduledAt: '',
  durationMinutes: '60',
  location: '',
  interviewerNames: '',
  notes: '',
}
