import { env } from '@/config/env'

/**
 * Thin, typed wrapper around `localStorage`.
 *
 * Keys are namespaced with the configured storage prefix so multiple apps on
 * the same origin never collide. All access is guarded so a disabled/full
 * storage (or SSR) degrades gracefully instead of throwing.
 */
const buildKey = (key: string): string => `${env.storagePrefix}:${key}`

export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(buildKey(key))
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(buildKey(key), JSON.stringify(value))
  } catch {
    /* storage unavailable or quota exceeded — ignore */
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(buildKey(key))
  } catch {
    /* ignore */
  }
}
