import { useDroppable } from '@dnd-kit/core'
import type { Application, ApplicationStatus } from '@/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/features/applications/constants'
import { cn } from '@/lib/utils'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: Application[]
}

export default function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {STATUS_LABELS[status]}
        </h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-32 flex-1 flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-2 transition dark:border-slate-800 dark:bg-slate-900/40',
          isOver && 'border-indigo-400 bg-indigo-50/60 dark:bg-indigo-500/10',
        )}
      >
        {applications.map((application) => (
          <KanbanCard key={application.id} application={application} />
        ))}
        {applications.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-slate-400">
            Drop here
          </p>
        )}
      </div>
    </div>
  )
}
