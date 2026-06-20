import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastsState {
  items: Toast[]
}

const initialState: ToastsState = { items: [] }

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.items.push(action.payload)
      },
      prepare(message: string, type: ToastType = 'success') {
        return { payload: { id: nanoid(), message, type } }
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
  },
})

export const { pushToast, dismissToast } = toastsSlice.actions
export default toastsSlice.reducer
