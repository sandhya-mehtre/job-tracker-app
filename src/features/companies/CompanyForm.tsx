import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { COMPANY_SIZES } from '@/types'
import { SelectInput, TextArea, TextInput } from '@/components/ui/form/fields'
import Button from '@/components/ui/Button'
import { companyFormSchema, type CompanyFormValues } from './companySchema'

interface CompanyFormProps {
  defaultValues: CompanyFormValues
  submitLabel: string
  onSubmit: (values: CompanyFormValues) => void
  onCancel: () => void
}

const SIZE_OPTIONS = COMPANY_SIZES.map((s) => ({ value: s, label: `${s} employees` }))

export default function CompanyForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextInput
        id="name"
        label="Company Name"
        required
        placeholder="Acme Inc."
        error={errors.name?.message}
        {...register('name')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          id="industry"
          label="Industry"
          placeholder="Fintech, SaaS, …"
          error={errors.industry?.message}
          {...register('industry')}
        />
        <SelectInput
          id="size"
          label="Company Size"
          placeholder="Select size…"
          options={SIZE_OPTIONS}
          error={errors.size?.message}
          {...register('size')}
        />
        <TextInput
          id="location"
          label="Location"
          placeholder="City, State / Remote"
          error={errors.location?.message}
          {...register('location')}
        />
        <TextInput
          id="website"
          label="Website"
          placeholder="https://…"
          error={errors.website?.message}
          {...register('website')}
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
