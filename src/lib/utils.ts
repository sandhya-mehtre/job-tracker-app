import type { ISODateString } from '@/types'

/** Generate a RFC-4122 v4 uuid (falls back to a random string on old runtimes). */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/** Current timestamp as an ISO string. */
export function nowIso(): ISODateString {
  return new Date().toISOString()
}

/**
 * Join conditional class names, dropping falsy values.
 * A tiny dependency-free alternative to `clsx`.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Format an ISO string as e.g. "Jun 18, 2026". Returns "—" for empty input. */
export function formatDate(iso: ISODateString | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Format an ISO string as e.g. "Jun 18, 2026, 3:00 PM". */
export function formatDateTime(iso: ISODateString | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Coarse relative-time label, e.g. "in 3 days" / "2 days ago" / "today". */
export function relativeFromNow(iso: ISODateString): string {
  const diffMs = new Date(iso).getTime() - Date.now()
  const days = Math.round(diffMs / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`
}
