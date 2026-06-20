import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import type { Application } from '@/types'
import { applicationDetailsPath } from '@/routes/paths'
import { SOURCE_LABELS, WORK_MODE_LABELS } from '@/features/applications/constants'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  application: Application
  /** True while this card is the floating drag overlay (no interactivity). */
  overlay?: boolean
}

export default function KanbanCard({ application, overlay }: KanbanCardProps) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !overlay && navigate(applicationDetailsPath(application.id))}
      className={cn(
        'cursor-grab touch-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800',
        isDragging && !overlay && 'opacity-40',
        overlay && 'rotate-2 cursor-grabbing shadow-lg',
      )}
    >
      <p className="text-sm font-medium text-slate-900 dark:text-white">
        {application.jobTitle}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {application.companyName}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {WORK_MODE_LABELS[application.workMode]}
        </span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {SOURCE_LABELS[application.source]}
        </span>
      </div>
    </div>
  )
}
