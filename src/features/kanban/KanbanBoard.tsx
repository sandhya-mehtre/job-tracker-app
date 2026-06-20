import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import { updateApplication } from '@/features/applications/applicationsSlice'
import { STATUS_LABELS } from '@/features/applications/constants'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'

/** Group applications by status into a column → applications map. */
function groupByStatus(
  applications: Application[],
): Record<ApplicationStatus, Application[]> {
  const groups = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, [] as Application[]]),
  ) as Record<ApplicationStatus, Application[]>
  for (const app of applications) groups[app.status].push(app)
  return groups
}

function isStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value)
}

export default function KanbanBoard() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const applications = useAppSelector((s) => s.applications.items)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Require a small drag distance so plain clicks still open the details page.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const columns = useMemo(() => groupByStatus(applications), [applications])
  const activeApplication = activeId
    ? applications.find((a) => a.id === activeId) ?? null
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const targetStatus = String(over.id)
    if (!isStatus(targetStatus)) return

    const app = applications.find((a) => a.id === active.id)
    if (app && app.status !== targetStatus) {
      dispatch(updateApplication({ id: app.id, changes: { status: targetStatus } }))
      toast.success(`Moved to ${STATUS_LABELS[targetStatus]}`)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} applications={columns[status]} />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <KanbanCard application={activeApplication} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
