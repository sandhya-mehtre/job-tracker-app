import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { dismissToast, type Toast, type ToastType } from '@/store/toastsSlice'
import { cn } from '@/lib/utils'

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'border-green-500/40 bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-200',
  error: 'border-red-500/40 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200',
  info: 'border-indigo-500/40 bg-indigo-50 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-200',
}

const ICON: Record<ToastType, string> = { success: '✓', error: '✕', info: 'i' }

const AUTO_DISMISS_MS = 3500

function ToastRow({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [dispatch, toast.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg',
        TYPE_STYLES[toast.type],
      )}
      role="status"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-bold dark:bg-white/10">
        {ICON[toast.type]}
      </span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => dispatch(dismissToast(toast.id))}
        aria-label="Dismiss"
        className="ml-2 text-current/60 hover:text-current"
      >
        ✕
      </button>
    </motion.div>
  )
}

/** Renders active toasts in the top-right corner. Mount once near the app root. */
export default function ToastViewport() {
  const toasts = useAppSelector((s) => s.toasts.items)

  return createPortal(
    <div className="pointer-events-none fixed top-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
