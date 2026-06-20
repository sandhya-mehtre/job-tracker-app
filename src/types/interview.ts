import type { BaseEntity, ID, ISODateString } from './common'

export const INTERVIEW_TYPES = [
  'phone-screen',
  'technical',
  'behavioral',
  'system-design',
  'onsite',
  'hr',
  'final',
] as const

export type InterviewType = (typeof INTERVIEW_TYPES)[number]

export const INTERVIEW_STATUSES = [
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled',
] as const

export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number]

export const INTERVIEW_OUTCOMES = ['pending', 'passed', 'failed'] as const

export type InterviewOutcome = (typeof INTERVIEW_OUTCOMES)[number]

export interface Interview extends BaseEntity {
  /** Application this interview belongs to. */
  applicationId: ID
  type: InterviewType
  status: InterviewStatus
  outcome: InterviewOutcome
  scheduledAt: ISODateString
  /** Duration in minutes. */
  durationMinutes: number
  location: string
  interviewerNames: string
  notes: string
}
