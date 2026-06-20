import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Centered placeholder shown when a list or widget has no data. */
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {title}
      </p>
      {description && (
        <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
