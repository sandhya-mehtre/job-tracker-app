import { useMemo, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { SearchIcon } from '@/components/ui/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Company } from '@/types'
import CompanyFormModal from './CompanyFormModal'
import { removeCompany } from './companiesSlice'

export default function CompaniesListPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const companies = useAppSelector((s) => s.companies.items)
  const applications = useAppSelector((s) => s.applications.items)

  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<{ company: Company | null } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Company | null>(null)

  // Count applications per company by name (applications store a company name).
  const appCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of applications) {
      const key = a.companyName.toLowerCase()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [applications])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return companies
    return companies.filter((c) =>
      `${c.name} ${c.industry} ${c.location}`.toLowerCase().includes(term),
    )
  }, [companies, search])

  const confirmDelete = () => {
    if (pendingDelete) {
      dispatch(removeCompany(pendingDelete.id))
      toast.info('Company deleted')
    }
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Keep notes on the companies you're targeting."
        action={
          <Button onClick={() => setEditor({ company: null })}>+ Add Company</Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10">
          <EmptyState
            title={companies.length === 0 ? 'No companies yet' : 'No matches'}
            description={
              companies.length === 0
                ? 'Add a company to start tracking it.'
                : 'Try a different search.'
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => {
            const count = appCounts.get(company.name.toLowerCase()) ?? 0
            return (
              <Card key={company.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                      {company.name}
                    </h3>
                    <p className="truncate text-xs text-slate-400">
                      {[company.industry, company.size && `${company.size} employees`]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                    {count} app{count === 1 ? '' : 's'}
                  </span>
                </div>

                <dl className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {company.location && <dd>{company.location}</dd>}
                  {company.website && (
                    <dd>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-indigo-600 hover:underline dark:text-indigo-300"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  )}
                </dl>

                {company.notes && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                    {company.notes}
                  </p>
                )}

                <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditor({ company })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    onClick={() => setPendingDelete(company)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <CompanyFormModal
        open={editor !== null}
        company={editor?.company}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete company"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}
