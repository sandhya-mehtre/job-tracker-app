import { useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { pushToast } from '@/store/toastsSlice'

/** Imperative toast helpers: `toast.success('Saved')`, `toast.error(...)`, etc. */
export function useToast() {
  const dispatch = useAppDispatch()

  const success = useCallback(
    (message: string) => dispatch(pushToast(message, 'success')),
    [dispatch],
  )
  const error = useCallback(
    (message: string) => dispatch(pushToast(message, 'error')),
    [dispatch],
  )
  const info = useCallback(
    (message: string) => dispatch(pushToast(message, 'info')),
    [dispatch],
  )

  return useMemo(() => ({ success, error, info }), [success, error, info])
}
