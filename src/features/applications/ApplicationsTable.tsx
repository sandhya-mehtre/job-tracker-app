import { useNavigate } from 'react-router-dom'
import DataTable, { type Column } from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { applicationDetailsPath } from '@/routes/paths'
import { formatDate } from '@/lib/utils'
import type { Application } from '@/types'
import { SOURCE_LABELS, WORK_MODE_LABELS } from './constants'

interface ApplicationsTableProps {
  applications: Application[]
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
  emptyTitle?: string
  emptyDescription?: string
}

export default function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
  emptyTitle,
  emptyDescription,
}: ApplicationsTableProps) {
  const navigate = useNavigate()

  const columns: Column<Application>[] = [
    {
      key: 'role',
      header: 'Role',
      render: (a) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{a.jobTitle}</p>
          <p className="text-xs text-slate-400">{a.companyName}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'workMode',
      header: 'Mode',
      hideOnMobile: true,
      render: (a) => WORK_MODE_LABELS[a.workMode],
    },
    {
      key: 'source',
      header: 'Source',
      hideOnMobile: true,
      render: (a) => SOURCE_LABELS[a.source],
    },
    {
      key: 'appliedDate',
      header: 'Applied',
      hideOnMobile: true,
      render: (a) => formatDate(a.appliedDate),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (a) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onEdit(a)}
            className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(a)}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={applications}
      getRowId={(a) => a.id}
      onRowClick={(a) => navigate(applicationDetailsPath(a.id))}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  )
}
