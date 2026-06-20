import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Interview } from '@/types'
import { readFromStorage } from '@/lib/storage'
import { SEED_INTERVIEWS } from '@/lib/seed'

export const INTERVIEWS_STORAGE_KEY = 'interviews'

export type InterviewInput = Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>

interface InterviewsState {
  items: Interview[]
}

const initialState: InterviewsState = {
  items: readFromStorage<Interview[]>(INTERVIEWS_STORAGE_KEY, SEED_INTERVIEWS),
}

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    addInterview: {
      reducer(state, action: PayloadAction<Interview>) {
        state.items.push(action.payload)
      },
      prepare(input: InterviewInput) {
        const now = new Date().toISOString()
        return {
          payload: { ...input, id: nanoid(), createdAt: now, updatedAt: now },
        }
      },
    },
    updateInterview(
      state,
      action: PayloadAction<{ id: string; changes: Partial<InterviewInput> }>,
    ) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        Object.assign(item, action.payload.changes)
        item.updatedAt = new Date().toISOString()
      }
    },
    removeInterview(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
  },
})

export const { addInterview, updateInterview, removeInterview } =
  interviewsSlice.actions

export default interviewsSlice.reducer
