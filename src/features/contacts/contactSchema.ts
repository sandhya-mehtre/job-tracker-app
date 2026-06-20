import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  /** Empty string means "no linked company". */
  companyId: z.string(),
  role: z.string().trim().max(80),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email')]),
  phone: z.string().trim().max(40),
  linkedinUrl: z.union([
    z.literal(''),
    z.string().trim().url('Enter a valid URL'),
  ]),
  notes: z.string().trim().max(2000),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const emptyContactForm: ContactFormValues = {
  name: '',
  companyId: '',
  role: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  notes: '',
}
