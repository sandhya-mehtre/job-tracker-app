import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Contact } from '@/types'
import { readFromStorage } from '@/lib/storage'
import { SEED_CONTACTS } from '@/lib/seed'

export const CONTACTS_STORAGE_KEY = 'contacts'

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>

interface ContactsState {
  items: Contact[]
}

const initialState: ContactsState = {
  items: readFromStorage<Contact[]>(CONTACTS_STORAGE_KEY, SEED_CONTACTS),
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: {
      reducer(state, action: PayloadAction<Contact>) {
        state.items.unshift(action.payload)
      },
      prepare(input: ContactInput) {
        const now = new Date().toISOString()
        return {
          payload: { ...input, id: nanoid(), createdAt: now, updatedAt: now },
        }
      },
    },
    updateContact(
      state,
      action: PayloadAction<{ id: string; changes: Partial<ContactInput> }>,
    ) {
      const contact = state.items.find((c) => c.id === action.payload.id)
      if (contact) {
        Object.assign(contact, action.payload.changes)
        contact.updatedAt = new Date().toISOString()
      }
    },
    removeContact(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
  },
})

export const { addContact, updateContact, removeContact } = contactsSlice.actions

export default contactsSlice.reducer
