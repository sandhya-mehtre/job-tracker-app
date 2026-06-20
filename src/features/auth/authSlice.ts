import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { readFromStorage, writeToStorage, removeFromStorage } from '@/lib/storage'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  jobTitle?: string
  location?: string
  phone?: string
  bio?: string
  avatarInitials: string
  createdAt: string
}

export interface AuthState {
  currentUser: UserProfile | null
  isAuthenticated: boolean
}

const AUTH_CURRENT_USER_KEY = 'auth.currentUser'
const AUTH_USERS_KEY = 'auth.users'

export interface StoredUser extends UserProfile {
  passwordHash: string
}

/** Very simple hash for demo purposes — not for production. */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function hashPassword(password: string): string {
  return simpleHash(password + 'jt_salt_2024')
}

export function getStoredUsers(): StoredUser[] {
  return readFromStorage<StoredUser[]>(AUTH_USERS_KEY, [])
}

export function saveStoredUsers(users: StoredUser[]): void {
  writeToStorage(AUTH_USERS_KEY, users)
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const storedCurrentUser = readFromStorage<UserProfile | null>(AUTH_CURRENT_USER_KEY, null)

const initialState: AuthState = {
  currentUser: storedCurrentUser,
  isAuthenticated: storedCurrentUser !== null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserProfile>) {
      state.currentUser = action.payload
      state.isAuthenticated = true
      writeToStorage(AUTH_CURRENT_USER_KEY, action.payload)
    },
    logout(state) {
      state.currentUser = null
      state.isAuthenticated = false
      removeFromStorage(AUTH_CURRENT_USER_KEY)
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (!state.currentUser) return
      const updated: UserProfile = {
        ...state.currentUser,
        ...action.payload,
        avatarInitials: action.payload.fullName
          ? getInitials(action.payload.fullName)
          : state.currentUser.avatarInitials,
      }
      state.currentUser = updated
      writeToStorage(AUTH_CURRENT_USER_KEY, updated)

      // Also update in the users list
      const users = getStoredUsers()
      const idx = users.findIndex((u) => u.id === updated.id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updated }
        saveStoredUsers(users)
      }
    },
  },
})

export function createUser(
  email: string,
  fullName: string,
  password: string,
): { success: true; user: UserProfile } | { success: false; error: string } {
  const users = getStoredUsers()
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return { success: false, error: 'An account with this email already exists.' }

  const user: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    email,
    fullName,
    avatarInitials: getInitials(fullName),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveStoredUsers(users)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _ph, ...profile } = user
  return { success: true, user: profile }
}

export function authenticateUser(
  email: string,
  password: string,
): { success: true; user: UserProfile } | { success: false; error: string } {
  const users = getStoredUsers()
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!found) return { success: false, error: 'No account found with this email.' }
  if (found.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password.' }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _ph, ...profile } = found
  return { success: true, user: profile }
}

export const { loginSuccess, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
