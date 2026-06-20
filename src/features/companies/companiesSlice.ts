import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Company } from '@/types'
import { readFromStorage } from '@/lib/storage'
import { SEED_COMPANIES } from '@/lib/seed'

export const COMPANIES_STORAGE_KEY = 'companies'

export type CompanyInput = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>

interface CompaniesState {
  items: Company[]
}

const initialState: CompaniesState = {
  items: readFromStorage<Company[]>(COMPANIES_STORAGE_KEY, SEED_COMPANIES),
}

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompany: {
      reducer(state, action: PayloadAction<Company>) {
        state.items.unshift(action.payload)
      },
      prepare(input: CompanyInput) {
        const now = new Date().toISOString()
        return {
          payload: { ...input, id: nanoid(), createdAt: now, updatedAt: now },
        }
      },
    },
    updateCompany(
      state,
      action: PayloadAction<{ id: string; changes: Partial<CompanyInput> }>,
    ) {
      const company = state.items.find((c) => c.id === action.payload.id)
      if (company) {
        Object.assign(company, action.payload.changes)
        company.updatedAt = new Date().toISOString()
      }
    },
    removeCompany(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
  },
})

export const { addCompany, updateCompany, removeCompany } = companiesSlice.actions

export default companiesSlice.reducer
