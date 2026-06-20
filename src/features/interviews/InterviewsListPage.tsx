import { useMemo, useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import DataTable, { type Column } from '@/components/ui/DataTable'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import { cn, formatDateTime } from '@/lib/utils'
import type { Interview } from '@/types'
import InterviewFormModal from './InterviewFormModal'
import InterviewTimeline from './InterviewTimeline'
import { removeInterview } from './interviewsSlice'
import {
  INTERVIEW_STATUS_BADGE_CLASSES,
  INTERVIEW_STATUS_LABELS,
  TYPE_LABELS,
} from './constants'

type ViewMode = 'list' | 'timeline'

export default function InterviewsListPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const interviews = useAppSelector((s) => s.interviews.items)
  const applications = useAppSelector((s) => s.applications.items)

  const [view, setView] = useState<ViewMode>('list')
  const [editor, setEditor] = useState<{ interview: Interview | null } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Interview | null>(null)

  const titleFor = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of applications) map.set(a.id, `${a.jobTitle} — ${a.companyName}`)
    return (id: string) => map.get(id) ?? 'Unknown application'
  }, [applications])

  // Most recent first.
  const sorted = useMemo(
    () =>
      [...interviews].sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      ),
    [interviews],
  )

  const confirmDelete = () => {
    if (pendingDelete) {
      dispatch(removeInterview(pendingDelete.id))
      toast.info('Interview deleted')
    }
    setPendingDelete(null)
  }

  const columns: Column<Interview>[] = [
    {
      key: 'application',
      header: 'Application',
      render: (i) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {titleFor(i.applicationId)}
          </p>
          <p className="text-xs text-slate-400">{TYPE_LABELS[i.type]}</p>
        </div>
      ),
    },
    {
      key: 'when',
      header: 'When',
      render: (i) => formatDateTime(i.scheduledAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => (
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            INTERVIEW_STATUS_BADGE_CLASSES[i.status],
          )}
        >
          {INTERVIEW_STATUS_LABELS[i.status]}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'text-right',
      render: (i) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditor({ interview: i })}
            className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(i)}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const toggleBtn = (mode: ViewMode, label: string) => (
    <button
      type="button"
      onClick={() => setView(mode)}
      className={cn(
        'h-8 rounded-md px-3 text-xs font-medium transition',
        view === mode
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
      )}
    >
      {label}
    </button>
  )

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Schedule and track every interview round."
        action={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {toggleBtn('list', 'List')}
              {toggleBtn('timeline', 'Timeline')}
            </div>
            <Button
              onClick={() => setEditor({ interview: null })}
              disabled={applications.length === 0}
            >
              + Schedule
            </Button>
          </div>
        }
      />

      {view === 'list' ? (
        <Card>
          <DataTable
            columns={columns}
            rows={sorted}
            getRowId={(i) => i.id}
            emptyTitle="No interviews scheduled"
            emptyDescription="Schedule your first interview to see it here."
          />
        </Card>
      ) : (
        <InterviewTimeline
          interviews={sorted}
          titleFor={titleFor}
          onEdit={(interview) => setEditor({ interview })}
        />
      )}

      <InterviewFormModal
        open={editor !== null}
        interview={editor?.interview}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete interview"
        message="Delete this interview? This can't be undone."
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}
