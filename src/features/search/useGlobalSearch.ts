import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { ROUTES, applicationDetailsPath } from '@/routes/paths'
import { STATUS_LABELS } from '@/features/applications/constants'
import { TYPE_LABELS } from '@/features/interviews/constants'
import { formatDateTime } from '@/lib/utils'

export type SearchGroup = 'Applications' | 'Companies' | 'Contacts' | 'Interviews'

export interface SearchResult {
  id: string
  group: SearchGroup
  title: string
  subtitle: string
  to: string
}

const MAX_PER_GROUP = 5

/** Searches across all entities for the given term and returns flat results. */
export function useGlobalSearch(term: string): SearchResult[] {
  const applications = useAppSelector((s) => s.applications.items)
  const companies = useAppSelector((s) => s.companies.items)
  const contacts = useAppSelector((s) => s.contacts.items)
  const interviews = useAppSelector((s) => s.interviews.items)

  return useMemo(() => {
    const q = term.trim().toLowerCase()
    if (!q) return []
    const has = (...parts: string[]) =>
      parts.join(' ').toLowerCase().includes(q)

    const appTitle = new Map(
      applications.map((a) => [a.id, `${a.jobTitle} — ${a.companyName}`]),
    )

    const results: SearchResult[] = []

    for (const a of applications) {
      if (results.filter((r) => r.group === 'Applications').length >= MAX_PER_GROUP)
        break
      if (has(a.jobTitle, a.companyName, a.location))
        results.push({
          id: a.id,
          group: 'Applications',
          title: a.jobTitle,
          subtitle: `${a.companyName} · ${STATUS_LABELS[a.status]}`,
          to: applicationDetailsPath(a.id),
        })
    }

    for (const c of companies) {
      if (results.filter((r) => r.group === 'Companies').length >= MAX_PER_GROUP)
        break
      if (has(c.name, c.industry, c.location))
        results.push({
          id: c.id,
          group: 'Companies',
          title: c.name,
          subtitle: c.industry || 'Company',
          to: ROUTES.companies,
        })
    }

    for (const c of contacts) {
      if (results.filter((r) => r.group === 'Contacts').length >= MAX_PER_GROUP)
        break
      if (has(c.name, c.role, c.email))
        results.push({
          id: c.id,
          group: 'Contacts',
          title: c.name,
          subtitle: c.role || c.email || 'Contact',
          to: ROUTES.contacts,
        })
    }

    for (const i of interviews) {
      if (results.filter((r) => r.group === 'Interviews').length >= MAX_PER_GROUP)
        break
      const linked = appTitle.get(i.applicationId) ?? ''
      if (has(TYPE_LABELS[i.type], linked, i.interviewerNames, i.location))
        results.push({
          id: i.id,
          group: 'Interviews',
          title: `${TYPE_LABELS[i.type]} — ${linked || 'Interview'}`,
          subtitle: formatDateTime(i.scheduledAt),
          to: applicationDetailsPath(i.applicationId),
        })
    }

    return results
  }, [term, applications, companies, contacts, interviews])
}
