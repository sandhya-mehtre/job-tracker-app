import Modal from '@/components/ui/Modal'
import { useAppDispatch } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Application } from '@/types'
import ApplicationForm from './ApplicationForm'
import { addApplication, updateApplication } from './applicationsSlice'
import { emptyApplicationForm, type ApplicationFormValues } from './applicationSchema'
import { toApplicationInput, toFormValues } from './mappers'

interface ApplicationFormModalProps {
  open: boolean
  onClose: () => void
  /** When provided, the modal edits this application; otherwise it creates one. */
  application?: Application | null
}

/** Create/edit application dialog. Reuses one form for both modes. */
export default function ApplicationFormModal({
  open,
  onClose,
  application,
}: ApplicationFormModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const isEdit = Boolean(application)

  const defaultValues: ApplicationFormValues = application
    ? toFormValues(application)
    : emptyApplicationForm

  const handleSubmit = (values: ApplicationFormValues) => {
    const input = toApplicationInput(values)
    if (application) {
      dispatch(updateApplication({ id: application.id, changes: input }))
      toast.success('Application updated')
    } else {
      dispatch(addApplication(input))
      toast.success('Application added')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Application' : 'Add Application'}
      size="max-w-2xl"
    >
      {/* Remount the form per record so defaults reset between opens. */}
      <ApplicationForm
        key={application?.id ?? 'new'}
        defaultValues={defaultValues}
        submitLabel={isEdit ? 'Save Changes' : 'Add Application'}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
