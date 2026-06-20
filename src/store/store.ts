import { configureStore } from '@reduxjs/toolkit'
import uiReducer, { THEME_KEY } from './uiSlice'
import toastsReducer from './toastsSlice'
import applicationsReducer, {
  APPLICATIONS_STORAGE_KEY,
} from '@/features/applications/applicationsSlice'
import interviewsReducer, {
  INTERVIEWS_STORAGE_KEY,
} from '@/features/interviews/interviewsSlice'
import companiesReducer, {
  COMPANIES_STORAGE_KEY,
} from '@/features/companies/companiesSlice'
import contactsReducer, {
  CONTACTS_STORAGE_KEY,
} from '@/features/contacts/contactsSlice'
import authReducer from '@/features/auth/authSlice'
import { writeToStorage } from '@/lib/storage'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    toasts: toastsReducer,
    applications: applicationsReducer,
    interviews: interviewsReducer,
    companies: companiesReducer,
    contacts: contactsReducer,
    auth: authReducer,
  },
})

/**
 * Persist slices to localStorage whenever the relevant part of state changes.
 * Each entry compares the previous reference (RTK keeps references stable when
 * a slice is untouched) so we only write what actually changed.
 */
function setupPersistence(): void {
  let prev = store.getState()
  store.subscribe(() => {
    const next = store.getState()
    if (next.ui.theme !== prev.ui.theme) {
      writeToStorage(THEME_KEY, next.ui.theme)
    }
    if (next.applications.items !== prev.applications.items) {
      writeToStorage(APPLICATIONS_STORAGE_KEY, next.applications.items)
    }
    if (next.interviews.items !== prev.interviews.items) {
      writeToStorage(INTERVIEWS_STORAGE_KEY, next.interviews.items)
    }
    if (next.companies.items !== prev.companies.items) {
      writeToStorage(COMPANIES_STORAGE_KEY, next.companies.items)
    }
    if (next.contacts.items !== prev.contacts.items) {
      writeToStorage(CONTACTS_STORAGE_KEY, next.contacts.items)
    }
    prev = next
  })
}

setupPersistence()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
