import Modal from '@/components/ui/Modal'
import { useAppDispatch } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Interview } from '@/types'
import InterviewForm from './InterviewForm'
import { addInterview, updateInterview } from './interviewsSlice'
import { emptyInterviewForm, type InterviewFormValues } from './interviewSchema'
import { toFormValues, toInterviewInput } from './mappers'

interface InterviewFormModalProps {
  open: boolean
  onClose: () => void
  interview?: Interview | null
  /** Pre-select an application when scheduling from a details page. */
  defaultApplicationId?: string
}

export default function InterviewFormModal({
  open,
  onClose,
  interview,
  defaultApplicationId,
}: InterviewFormModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const isEdit = Boolean(interview)

  const defaultValues: InterviewFormValues = interview
    ? toFormValues(interview)
    : { ...emptyInterviewForm, applicationId: defaultApplicationId ?? '' }

  const handleSubmit = (values: InterviewFormValues) => {
    const input = toInterviewInput(values)
    if (interview) {
      dispatch(updateInterview({ id: interview.id, changes: input }))
      toast.success('Interview updated')
    } else {
      dispatch(addInterview(input))
      toast.success('Interview scheduled')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Interview' : 'Schedule Interview'}
      size="max-w-2xl"
    >
      <InterviewForm
        key={interview?.id ?? defaultApplicationId ?? 'new'}
        defaultValues={defaultValues}
        submitLabel={isEdit ? 'Save Changes' : 'Schedule'}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
