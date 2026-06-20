import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { readFromStorage } from '@/lib/storage'

export type Theme = 'light' | 'dark'

export interface UiState {
  theme: Theme
  /** Controls the off-canvas sidebar on mobile. */
  mobileSidebarOpen: boolean
  /** Global command/search palette visibility. */
  searchOpen: boolean
  /** Quick-add chooser visibility. */
  quickAddOpen: boolean
}

const THEME_STORAGE_KEY = 'ui.theme'

/** Resolve the initial theme: stored preference → OS preference → light. */
function getInitialTheme(): Theme {
  const stored = readFromStorage<Theme | null>(THEME_STORAGE_KEY, null)
  if (stored === 'light' || stored === 'dark') return stored
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'light'
}

const initialState: UiState = {
  theme: getInitialTheme(),
  mobileSidebarOpen: false,
  searchOpen: false,
  quickAddOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
    openMobileSidebar(state) {
      state.mobileSidebarOpen = true
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload
    },
    setQuickAddOpen(state, action: PayloadAction<boolean>) {
      state.quickAddOpen = action.payload
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  openMobileSidebar,
  closeMobileSidebar,
  toggleMobileSidebar,
  setSearchOpen,
  setQuickAddOpen,
} = uiSlice.actions

export const THEME_KEY = THEME_STORAGE_KEY
export default uiSlice.reducer
