import type { ComponentType, SVGProps } from 'react'
import { ROUTES } from '@/routes/paths'
import {
  AnalyticsIcon,
  ApplicationsIcon,
  CompaniesIcon,
  ContactsIcon,
  DashboardIcon,
  InterviewsIcon,
  KanbanIcon,
} from '@/components/ui/icons'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Match only the exact path (used for the index route). */
  end?: boolean
}

/** Primary sidebar navigation, in display order. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: DashboardIcon, end: true },
  { label: 'Applications', to: ROUTES.applications, icon: ApplicationsIcon },
  { label: 'Kanban', to: ROUTES.kanban, icon: KanbanIcon },
  { label: 'Companies', to: ROUTES.companies, icon: CompaniesIcon },
  { label: 'Contacts', to: ROUTES.contacts, icon: ContactsIcon },
  { label: 'Interviews', to: ROUTES.interviews, icon: InterviewsIcon },
  { label: 'Analytics', to: ROUTES.analytics, icon: AnalyticsIcon },
]
