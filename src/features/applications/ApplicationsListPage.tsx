import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Application } from '@/types'
import ApplicationsToolbar from './ApplicationsToolbar'
import ApplicationsTable from './ApplicationsTable'
import ApplicationFormModal from './ApplicationFormModal'
import { useApplicationFilters } from './useApplicationFilters'
import { removeApplication } from './applicationsSlice'

export default function ApplicationsListPage() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const applications = useAppSelector((s) => s.applications.items)
  const { filters, setFilters, reset, filtered, hasActiveFilters } =
    useApplicationFilters(applications)

  // `null` = closed. `{ application }` opens the editor (undefined = create).
  const [editor, setEditor] = useState<{ application: Application | null } | null>(
    null,
  )
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null)

  const confirmDelete = () => {
    if (pendingDelete) {
      dispatch(removeApplication(pendingDelete.id))
      toast.info('Application deleted')
    }
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Track every role you're pursuing."
        action={
          <Button onClick={() => setEditor({ application: null })}>
            + Add Application
          </Button>
        }
      />

      <ApplicationsToolbar
        filters={filters}
        onChange={setFilters}
        onReset={reset}
        resultCount={filtered.length}
        hasActiveFilters={hasActiveFilters}
      />

      <Card>
        <ApplicationsTable
          applications={filtered}
          onEdit={(application) => setEditor({ application })}
          onDelete={setPendingDelete}
          emptyTitle={
            applications.length === 0
              ? 'No applications yet'
              : 'No applications match your filters'
          }
          emptyDescription={
            applications.length === 0
              ? 'Add your first application to get started.'
              : 'Try adjusting or clearing your filters.'
          }
        />
      </Card>

      <ApplicationFormModal
        open={editor !== null}
        application={editor?.application}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete application"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.jobTitle}" at ${pendingDelete.companyName}? This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}
