import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectInput, TextArea, TextInput } from '@/components/ui/form/fields'
import Button from '@/components/ui/Button'
import { useAppSelector } from '@/store/hooks'
import {
  DURATION_OPTIONS,
  INTERVIEW_STATUS_LABELS,
  OUTCOME_LABELS,
  TYPE_LABELS,
} from './constants'
import { interviewFormSchema, type InterviewFormValues } from './interviewSchema'
import { toOptions } from '@/features/applications/constants'

interface InterviewFormProps {
  defaultValues: InterviewFormValues
  submitLabel: string
  onSubmit: (values: InterviewFormValues) => void
  onCancel: () => void
}

const TYPE_OPTIONS = toOptions(TYPE_LABELS)
const STATUS_OPTIONS = toOptions(INTERVIEW_STATUS_LABELS)
const OUTCOME_OPTIONS = toOptions(OUTCOME_LABELS)

export default function InterviewForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: InterviewFormProps) {
  const applications = useAppSelector((s) => s.applications.items)
  const applicationOptions = applications.map((a) => ({
    value: a.id,
    label: `${a.jobTitle} — ${a.companyName}`,
  }))

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <SelectInput
        id="applicationId"
        label="Application"
        required
        placeholder="Select an application…"
        options={applicationOptions}
        error={errors.applicationId?.message}
        {...register('applicationId')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectInput
          id="type"
          label="Interview Type"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
          {...register('type')}
        />
        <SelectInput
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />
        <TextInput
          id="scheduledAt"
          label="Date & Time"
          type="datetime-local"
          required
          error={errors.scheduledAt?.message}
          {...register('scheduledAt')}
        />
        <SelectInput
          id="durationMinutes"
          label="Duration"
          options={DURATION_OPTIONS}
          error={errors.durationMinutes?.message}
          {...register('durationMinutes')}
        />
        <SelectInput
          id="outcome"
          label="Outcome"
          options={OUTCOME_OPTIONS}
          error={errors.outcome?.message}
          {...register('outcome')}
        />
        <TextInput
          id="location"
          label="Location / Link"
          placeholder="Zoom, on-site, phone…"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      <TextInput
        id="interviewerNames"
        label="Interviewer(s)"
        placeholder="Comma-separated names"
        error={errors.interviewerNames?.message}
        {...register('interviewerNames')}
      />

      <TextArea
        id="notes"
        label="Notes"
        placeholder="Prep notes, topics, feedback…"
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
