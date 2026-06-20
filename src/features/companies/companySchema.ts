import { z } from 'zod'
import { COMPANY_SIZES } from '@/types'

export const companyFormSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required').max(120),
  industry: z.string().trim().max(80),
  size: z.union([z.literal(''), z.enum(COMPANY_SIZES)]),
  website: z.union([z.literal(''), z.string().trim().url('Enter a valid URL')]),
  location: z.string().trim().max(120),
  notes: z.string().trim().max(2000),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>

export const emptyCompanyForm: CompanyFormValues = {
  name: '',
  industry: '',
  size: '',
  website: '',
  location: '',
  notes: '',
}
