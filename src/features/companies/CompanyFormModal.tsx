import Modal from '@/components/ui/Modal'
import { useAppDispatch } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Company } from '@/types'
import CompanyForm from './CompanyForm'
import { addCompany, updateCompany } from './companiesSlice'
import { emptyCompanyForm, type CompanyFormValues } from './companySchema'

interface CompanyFormModalProps {
  open: boolean
  onClose: () => void
  company?: Company | null
}

export default function CompanyFormModal({
  open,
  onClose,
  company,
}: CompanyFormModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const isEdit = Boolean(company)

  const defaultValues: CompanyFormValues = company
    ? {
        name: company.name,
        industry: company.industry,
        size: company.size,
        website: company.website,
        location: company.location,
        notes: company.notes,
      }
    : emptyCompanyForm

  const handleSubmit = (values: CompanyFormValues) => {
    if (company) {
      dispatch(updateCompany({ id: company.id, changes: values }))
      toast.success('Company updated')
    } else {
      dispatch(addCompany(values))
      toast.success('Company added')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Company' : 'Add Company'}
      size="max-w-xl"
    >
      <CompanyForm
        key={company?.id ?? 'new'}
        defaultValues={defaultValues}
        submitLabel={isEdit ? 'Save Changes' : 'Add Company'}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
