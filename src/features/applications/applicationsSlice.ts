import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Application } from '@/types'
import { readFromStorage } from '@/lib/storage'
import { SEED_APPLICATIONS } from '@/lib/seed'

export const APPLICATIONS_STORAGE_KEY = 'applications'

/** Editable fields of an application (everything except server-managed fields). */
export type ApplicationInput = Omit<
  Application,
  'id' | 'createdAt' | 'updatedAt'
>

interface ApplicationsState {
  items: Application[]
}

const initialState: ApplicationsState = {
  items: readFromStorage<Application[]>(
    APPLICATIONS_STORAGE_KEY,
    SEED_APPLICATIONS,
  ),
}

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    addApplication: {
      reducer(state, action: PayloadAction<Application>) {
        state.items.unshift(action.payload)
      },
      prepare(input: ApplicationInput) {
        const now = new Date().toISOString()
        return {
          payload: { ...input, id: nanoid(), createdAt: now, updatedAt: now },
        }
      },
    },
    updateApplication(
      state,
      action: PayloadAction<{ id: string; changes: Partial<ApplicationInput> }>,
    ) {
      const app = state.items.find((a) => a.id === action.payload.id)
      if (app) {
        Object.assign(app, action.payload.changes)
        app.updatedAt = new Date().toISOString()
      }
    },
    removeApplication(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.id !== action.payload)
    },
  },
})

export const { addApplication, updateApplication, removeApplication } =
  applicationsSlice.actions

export default applicationsSlice.reducer
