import PageHeader from '@/components/ui/PageHeader'
import KanbanBoard from './KanbanBoard'

/** Kanban board page (Tasks 25–28). */
export default function KanbanPage() {
  return (
    <div>
      <PageHeader
        title="Kanban Board"
        subtitle="Drag an application between columns to update its status."
      />
      <KanbanBoard />
    </div>
  )
}
