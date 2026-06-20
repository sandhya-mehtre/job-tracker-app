import { useMemo, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import DataTable, { type Column } from '@/components/ui/DataTable'
import { SearchIcon } from '@/components/ui/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Contact } from '@/types'
import ContactFormModal from './ContactFormModal'
import { removeContact } from './contactsSlice'

export default function ContactsListPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const contacts = useAppSelector((s) => s.contacts.items)
  const companies = useAppSelector((s) => s.companies.items)

  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<{ contact: Contact | null } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null)

  const companyName = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of companies) map.set(c.id, c.name)
    return map
  }, [companies])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return contacts
    return contacts.filter((c) => {
      const company = c.companyId ? (companyName.get(c.companyId) ?? '') : ''
      return `${c.name} ${c.role} ${c.email} ${company}`
        .toLowerCase()
        .includes(term)
    })
  }, [contacts, search, companyName])

  const confirmDelete = () => {
    if (pendingDelete) {
      dispatch(removeContact(pendingDelete.id))
      toast.info('Contact deleted')
    }
    setPendingDelete(null)
  }

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
          {c.role && <p className="text-xs text-slate-400">{c.role}</p>}
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      hideOnMobile: true,
      render: (c) => (c.companyId ? (companyName.get(c.companyId) ?? '—') : '—'),
    },
    {
      key: 'email',
      header: 'Email',
      render: (c) =>
        c.email ? (
          <a
            href={`mailto:${c.email}`}
            className="text-indigo-600 hover:underline dark:text-indigo-300"
            onClick={(e) => e.stopPropagation()}
          >
            {c.email}
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'phone', header: 'Phone', hideOnMobile: true, render: (c) => c.phone || '—' },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditor({ contact: c })}
            className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(c)}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Recruiters, hiring managers, and referrals."
        action={
          <Button onClick={() => setEditor({ contact: null })}>+ Add Contact</Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts…"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(c) => c.id}
          emptyTitle={contacts.length === 0 ? 'No contacts yet' : 'No matches'}
          emptyDescription={
            contacts.length === 0
              ? 'Add a contact to start your network.'
              : 'Try a different search.'
          }
        />
      </Card>

      <ContactFormModal
        open={editor !== null}
        contact={editor?.contact}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete contact"
        message={
          pendingDelete ? `Delete "${pendingDelete.name}"? This can't be undone.` : ''
        }
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}
