import type { BaseEntity, ID, ISODateString } from './common'

/** Pipeline stage of a job application. */
export const APPLICATION_STATUSES = [
  'wishlist',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'accepted',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

/** Employment type for the role. */
export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'temporary',
] as const

export type JobType = (typeof JOB_TYPES)[number]

/** Where the work is performed. */
export const WORK_MODES = ['remote', 'hybrid', 'on-site'] as const

export type WorkMode = (typeof WORK_MODES)[number]

/** How the opportunity was discovered. */
export const APPLICATION_SOURCES = [
  'linkedin',
  'indeed',
  'referral',
  'company-website',
  'recruiter',
  'job-board',
  'other',
] as const

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number]

export interface Application extends BaseEntity {
  jobTitle: string
  companyId: ID | null
  /** Denormalized company name for quick display when no companyId is linked. */
  companyName: string
  status: ApplicationStatus
  jobType: JobType
  workMode: WorkMode
  source: ApplicationSource
  location: string
  /** Salary range as free text, e.g. "$120k – $140k". */
  salaryRange: string
  jobUrl: string
  appliedDate: ISODateString | null
  notes: string
}
