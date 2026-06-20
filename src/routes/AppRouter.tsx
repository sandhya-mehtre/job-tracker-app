import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import RequireAuth from '@/features/auth/RequireAuth'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import { ROUTES } from './paths'
import PlaceholderPage from './PlaceholderPage'

/**
 * Application router. All pages render inside the shared <AppLayout /> shell,
 * which also provides the Suspense boundary for these lazily-loaded routes.
 * Code-splitting keeps heavy pages (charts, board) out of the initial bundle.
 */
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const ApplicationsListPage = lazy(
  () => import('@/features/applications/ApplicationsListPage'),
)
const ApplicationDetailsPage = lazy(
  () => import('@/features/applications/ApplicationDetailsPage'),
)
const KanbanPage = lazy(() => import('@/features/kanban/KanbanPage'))
const CompaniesListPage = lazy(
  () => import('@/features/companies/CompaniesListPage'),
)
const ContactsListPage = lazy(() => import('@/features/contacts/ContactsListPage'))
const InterviewsListPage = lazy(
  () => import('@/features/interviews/InterviewsListPage'),
)
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage'))
const ProfilePage = lazy(() => import('@/features/auth/ProfilePage'))

const router = createBrowserRouter([
  // Public routes
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.signup, element: <SignupPage /> },

  // Protected routes — wrapped in RequireAuth
  {
    element: <RequireAuth />,
    children: [
      {
        path: ROUTES.dashboard,
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: ROUTES.applications, element: <ApplicationsListPage /> },
          { path: ROUTES.applicationDetails, element: <ApplicationDetailsPage /> },
          { path: ROUTES.kanban, element: <KanbanPage /> },
          { path: ROUTES.companies, element: <CompaniesListPage /> },
          { path: ROUTES.contacts, element: <ContactsListPage /> },
          { path: ROUTES.interviews, element: <InterviewsListPage /> },
          { path: ROUTES.analytics, element: <AnalyticsPage /> },
          { path: ROUTES.profile, element: <ProfilePage /> },
          { path: '*', element: <PlaceholderPage title="404 — Not Found" /> },
        ],
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
