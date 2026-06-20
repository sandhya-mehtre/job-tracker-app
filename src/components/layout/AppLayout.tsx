import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import ToastViewport from '@/components/ui/ToastViewport'
import { PageSkeleton } from '@/components/ui/Skeleton'
import GlobalSearch from '@/features/search/GlobalSearch'
import QuickAddModal from '@/features/quick-add/QuickAddModal'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'

/**
 * Shared application shell: fixed sidebar + sticky header, with routed pages
 * rendered into the main content area via <Outlet />. Also mounts the global
 * overlays (search, quick-add, toasts) once for the whole app.
 */
export default function AppLayout() {
  useGlobalShortcuts()

  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <GlobalSearch />
      <QuickAddModal />
      <ToastViewport />
    </div>
  )
}
