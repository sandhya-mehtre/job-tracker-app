import type { Application } from '@/types'
import type { ApplicationInput } from './applicationsSlice'
import type { ApplicationFormValues } from './applicationSchema'

/** ISO date-time → `YYYY-MM-DD` for a date input (empty string if null). */
function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : ''
}

/** `YYYY-MM-DD` → ISO date-time at midnight UTC (null if empty). */
function fromDateInput(value: string): string | null {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : null
}

/** Map a stored application to editable form values. */
export function toFormValues(app: Application): ApplicationFormValues {
  return {
    jobTitle: app.jobTitle,
    companyName: app.companyName,
    status: app.status,
    jobType: app.jobType,
    workMode: app.workMode,
    source: app.source,
    location: app.location,
    salaryRange: app.salaryRange,
    jobUrl: app.jobUrl,
    appliedDate: toDateInput(app.appliedDate),
    notes: app.notes,
  }
}

/** Map validated form values to the slice input shape. */
export function toApplicationInput(values: ApplicationFormValues): ApplicationInput {
  return {
    jobTitle: values.jobTitle,
    companyName: values.companyName,
    companyId: null,
    status: values.status,
    jobType: values.jobType,
    workMode: values.workMode,
    source: values.source,
    location: values.location,
    salaryRange: values.salaryRange,
    jobUrl: values.jobUrl,
    appliedDate: fromDateInput(values.appliedDate),
    notes: values.notes,
  }
}
