import Modal from '@/components/ui/Modal'
import { useAppDispatch } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { Contact } from '@/types'
import ContactForm from './ContactForm'
import { addContact, updateContact, type ContactInput } from './contactsSlice'
import { emptyContactForm, type ContactFormValues } from './contactSchema'

interface ContactFormModalProps {
  open: boolean
  onClose: () => void
  contact?: Contact | null
}

/** Map form values (companyId as string) to the slice input (companyId nullable). */
function toContactInput(values: ContactFormValues): ContactInput {
  return { ...values, companyId: values.companyId || null }
}

export default function ContactFormModal({
  open,
  onClose,
  contact,
}: ContactFormModalProps) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const isEdit = Boolean(contact)

  const defaultValues: ContactFormValues = contact
    ? {
        name: contact.name,
        companyId: contact.companyId ?? '',
        role: contact.role,
        email: contact.email,
        phone: contact.phone,
        linkedinUrl: contact.linkedinUrl,
        notes: contact.notes,
      }
    : emptyContactForm

  const handleSubmit = (values: ContactFormValues) => {
    const input = toContactInput(values)
    if (contact) {
      dispatch(updateContact({ id: contact.id, changes: input }))
      toast.success('Contact updated')
    } else {
      dispatch(addContact(input))
      toast.success('Contact added')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Contact' : 'Add Contact'}
      size="max-w-xl"
    >
      <ContactForm
        key={contact?.id ?? 'new'}
        defaultValues={defaultValues}
        submitLabel={isEdit ? 'Save Changes' : 'Add Contact'}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
