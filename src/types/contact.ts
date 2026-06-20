import type { BaseEntity, ID } from './common'

export interface Contact extends BaseEntity {
  name: string
  /** Optional company this contact belongs to. */
  companyId: ID | null
  role: string
  email: string
  phone: string
  linkedinUrl: string
  notes: string
}
