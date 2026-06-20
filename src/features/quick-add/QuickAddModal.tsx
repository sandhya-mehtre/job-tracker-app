import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setQuickAddOpen } from '@/store/uiSlice'
import {
  ApplicationsIcon,
  CompaniesIcon,
  ContactsIcon,
  InterviewsIcon,
} from '@/components/ui/icons'
import ApplicationFormModal from '@/features/applications/ApplicationFormModal'
import CompanyFormModal from '@/features/companies/CompanyFormModal'
import ContactFormModal from '@/features/contacts/ContactFormModal'
import InterviewFormModal from '@/features/interviews/InterviewFormModal'

type Entity = 'application' | 'company' | 'contact' | 'interview'

const CHOICES: {
  entity: Entity
  label: string
  icon: typeof ApplicationsIcon
}[] = [
  { entity: 'application', label: 'Application', icon: ApplicationsIcon },
  { entity: 'company', label: 'Company', icon: CompaniesIcon },
  { entity: 'contact', label: 'Contact', icon: ContactsIcon },
  { entity: 'interview', label: 'Interview', icon: InterviewsIcon },
]

/**
 * Quick-add chooser. Opens a small grid of entity buttons; picking one closes
 * the chooser and opens that entity's create form.
 */
export default function QuickAddModal() {
  const open = useAppSelector((s) => s.ui.quickAddOpen)
  const hasApplications = useAppSelector((s) => s.applications.items.length > 0)
  const dispatch = useAppDispatch()
  const [active, setActive] = useState<Entity | null>(null)

  const closeChooser = () => dispatch(setQuickAddOpen(false))

  const pick = (entity: Entity) => {
    closeChooser()
    setActive(entity)
  }

  return (
    <>
      <Modal open={open} onClose={closeChooser} title="Quick Add" size="max-w-md">
        <div className="grid grid-cols-2 gap-3">
          {CHOICES.map(({ entity, label, icon: Icon }) => {
            const disabled = entity === 'interview' && !hasApplications
            return (
              <button
                key={entity}
                type="button"
                disabled={disabled}
                onClick={() => pick(entity)}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
                title={disabled ? 'Add an application first' : undefined}
              >
                <Icon className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
                {label}
              </button>
            )
          })}
        </div>
      </Modal>

      <ApplicationFormModal
        open={active === 'application'}
        onClose={() => setActive(null)}
      />
      <CompanyFormModal open={active === 'company'} onClose={() => setActive(null)} />
      <ContactFormModal open={active === 'contact'} onClose={() => setActive(null)} />
      <InterviewFormModal
        open={active === 'interview'}
        onClose={() => setActive(null)}
      />
    </>
  )
}
