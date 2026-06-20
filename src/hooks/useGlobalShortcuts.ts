import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setSearchOpen } from '@/store/uiSlice'

/** Registers app-wide keyboard shortcuts. ⌘K / Ctrl+K opens global search. */
export function useGlobalShortcuts(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        dispatch(setSearchOpen(true))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dispatch])
}
