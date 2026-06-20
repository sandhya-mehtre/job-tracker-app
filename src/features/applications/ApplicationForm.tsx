import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectInput, TextArea, TextInput } from '@/components/ui/form/fields'
import Button from '@/components/ui/Button'
import {
  JOB_TYPE_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  WORK_MODE_LABELS,
  toOptions,
} from './constants'
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from './applicationSchema'

interface ApplicationFormProps {
  defaultValues: ApplicationFormValues
  submitLabel: string
  onSubmit: (values: ApplicationFormValues) => void
  onCancel: () => void
}

const STATUS_OPTIONS = toOptions(STATUS_LABELS)
const JOB_TYPE_OPTIONS = toOptions(JOB_TYPE_LABELS)
const WORK_MODE_OPTIONS = toOptions(WORK_MODE_LABELS)
const SOURCE_OPTIONS = toOptions(SOURCE_LABELS)

export default function ApplicationForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          id="jobTitle"
          label="Job Title"
          required
          placeholder="Senior Frontend Engineer"
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
        <TextInput
          id="companyName"
          label="Company"
          required
          placeholder="Acme Inc."
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <SelectInput
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />
        <SelectInput
          id="source"
          label="Source"
          options={SOURCE_OPTIONS}
          error={errors.source?.message}
          {...register('source')}
        />
        <SelectInput
          id="jobType"
          label="Job Type"
          options={JOB_TYPE_OPTIONS}
          error={errors.jobType?.message}
          {...register('jobType')}
        />
        <SelectInput
          id="workMode"
          label="Work Mode"
          options={WORK_MODE_OPTIONS}
          error={errors.workMode?.message}
          {...register('workMode')}
        />
        <TextInput
          id="location"
          label="Location"
          placeholder="Remote / City, State"
          error={errors.location?.message}
          {...register('location')}
        />
        <TextInput
          id="salaryRange"
          label="Salary Range"
          placeholder="$120k – $150k"
          error={errors.salaryRange?.message}
          {...register('salaryRange')}
        />
        <TextInput
          id="appliedDate"
          label="Applied Date"
          type="date"
          error={errors.appliedDate?.message}
          {...register('appliedDate')}
        />
        <TextInput
          id="jobUrl"
          label="Job URL"
          placeholder="https://…"
          error={errors.jobUrl?.message}
          {...register('jobUrl')}
        />
      </div>

      <TextArea
        id="notes"
        label="Notes"
        placeholder="Anything worth remembering…"
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
