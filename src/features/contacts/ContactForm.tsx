import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectInput, TextArea, TextInput } from '@/components/ui/form/fields'
import Button from '@/components/ui/Button'
import { useAppSelector } from '@/store/hooks'
import { contactFormSchema, type ContactFormValues } from './contactSchema'

interface ContactFormProps {
  defaultValues: ContactFormValues
  submitLabel: string
  onSubmit: (values: ContactFormValues) => void
  onCancel: () => void
}

export default function ContactForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const companies = useAppSelector((s) => s.companies.items)
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }))

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          id="name"
          label="Name"
          required
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextInput
          id="role"
          label="Role"
          placeholder="Recruiter, Hiring Manager…"
          error={errors.role?.message}
          {...register('role')}
        />
        <SelectInput
          id="companyId"
          label="Company"
          placeholder="No company"
          options={companyOptions}
          error={errors.companyId?.message}
          {...register('companyId')}
        />
        <TextInput
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextInput
          id="phone"
          label="Phone"
          placeholder="+1 555-0100"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <TextInput
          id="linkedinUrl"
          label="LinkedIn"
          placeholder="https://linkedin.com/in/…"
          error={errors.linkedinUrl?.message}
          {...register('linkedinUrl')}
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
