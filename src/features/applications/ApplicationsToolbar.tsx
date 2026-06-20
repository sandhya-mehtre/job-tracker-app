import { SearchIcon } from '@/components/ui/icons'
import Button from '@/components/ui/Button'
import {
  SOURCE_LABELS,
  STATUS_LABELS,
  WORK_MODE_LABELS,
  toOptions,
} from './constants'
import type { ApplicationFilters } from './useApplicationFilters'

interface ApplicationsToolbarProps {
  filters: ApplicationFilters
  onChange: (patch: Partial<ApplicationFilters>) => void
  onReset: () => void
  resultCount: number
  hasActiveFilters: boolean
}

const STATUS_OPTIONS = toOptions(STATUS_LABELS)
const WORK_MODE_OPTIONS = toOptions(WORK_MODE_LABELS)
const SOURCE_OPTIONS = toOptions(SOURCE_LABELS)

const selectClass =
  'h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'

export default function ApplicationsToolbar({
  filters,
  onChange,
  onReset,
  resultCount,
  hasActiveFilters,
}: ApplicationsToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by title, company, or location…"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as ApplicationFilters['status'] })}
        className={selectClass}
      >
        <option value="all">All statuses</option>
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by work mode"
        value={filters.workMode}
        onChange={(e) => onChange({ workMode: e.target.value as ApplicationFilters['workMode'] })}
        className={selectClass}
      >
        <option value="all">All modes</option>
        {WORK_MODE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by source"
        value={filters.source}
        onChange={(e) => onChange({ source: e.target.value as ApplicationFilters['source'] })}
        className={selectClass}
      >
        <option value="all">All sources</option>
        {SOURCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear
        </Button>
      )}

      <span className="ml-auto text-sm text-slate-400">
        {resultCount} result{resultCount === 1 ? '' : 's'}
      </span>
    </div>
  )
}
