import type { BaseEntity } from './common'

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const

export type CompanySize = (typeof COMPANY_SIZES)[number]

export interface Company extends BaseEntity {
  name: string
  industry: string
  size: CompanySize | ''
  website: string
  location: string
  notes: string
}
