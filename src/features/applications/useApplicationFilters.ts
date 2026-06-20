import { useMemo, useState } from 'react'
import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  WorkMode,
} from '@/types'

export interface ApplicationFilters {
  search: string
  status: ApplicationStatus | 'all'
  workMode: WorkMode | 'all'
  source: ApplicationSource | 'all'
}

const DEFAULT_FILTERS: ApplicationFilters = {
  search: '',
  status: 'all',
  workMode: 'all',
  source: 'all',
}

interface UseApplicationFiltersResult {
  filters: ApplicationFilters
  setFilters: (patch: Partial<ApplicationFilters>) => void
  reset: () => void
  filtered: Application[]
  hasActiveFilters: boolean
}

/** Local search + filter state plus the derived, filtered application list. */
export function useApplicationFilters(
  applications: Application[],
): UseApplicationFiltersResult {
  const [filters, setFiltersState] = useState<ApplicationFilters>(DEFAULT_FILTERS)

  const setFilters = (patch: Partial<ApplicationFilters>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }))

  const reset = () => setFiltersState(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    return applications.filter((app) => {
      if (filters.status !== 'all' && app.status !== filters.status) return false
      if (filters.workMode !== 'all' && app.workMode !== filters.workMode) return false
      if (filters.source !== 'all' && app.source !== filters.source) return false
      if (term) {
        const haystack =
          `${app.jobTitle} ${app.companyName} ${app.location}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [applications, filters])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.workMode !== 'all' ||
    filters.source !== 'all'

  return { filters, setFilters, reset, filtered, hasActiveFilters }
}
