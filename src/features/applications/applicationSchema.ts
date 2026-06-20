import { z } from 'zod'
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  JOB_TYPES,
  WORK_MODES,
} from '@/types'

/**
 * Validation schema for the application create/edit form.
 *
 * The form works entirely with strings (HTML inputs); optional fields simply
 * allow an empty string and the date is a plain `YYYY-MM-DD` string. The form
 * always supplies every field, so no schema-level defaults are needed (which
 * keeps the inferred input/output types identical for React Hook Form).
 * `toApplicationInput` maps the validated values to the persisted shape.
 */
export const applicationFormSchema = z.object({
  jobTitle: z.string().trim().min(1, 'Job title is required').max(120),
  companyName: z.string().trim().min(1, 'Company is required').max(120),
  status: z.enum(APPLICATION_STATUSES),
  jobType: z.enum(JOB_TYPES),
  workMode: z.enum(WORK_MODES),
  source: z.enum(APPLICATION_SOURCES),
  location: z.string().trim().max(120),
  salaryRange: z.string().trim().max(60),
  jobUrl: z.union([z.literal(''), z.string().trim().url('Enter a valid URL')]),
  appliedDate: z.string(),
  notes: z.string().trim().max(2000),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>

/** Default values for a brand-new application form. */
export const emptyApplicationForm: ApplicationFormValues = {
  jobTitle: '',
  companyName: '',
  status: 'wishlist',
  jobType: 'full-time',
  workMode: 'remote',
  source: 'linkedin',
  location: '',
  salaryRange: '',
  jobUrl: '',
  appliedDate: '',
  notes: '',
}
