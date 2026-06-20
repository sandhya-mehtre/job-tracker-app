import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme, toggleTheme, type Theme } from '@/store/uiSlice'

interface UseThemeResult {
  theme: Theme
  isDark: boolean
  toggle: () => void
  set: (theme: Theme) => void
}

/**
 * Reads the current theme from Redux and keeps the `<html>` element's `dark`
 * class in sync so Tailwind's `dark:` variants apply. Persistence is handled
 * by the store subscription.
 */
export function useTheme(): UseThemeResult {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  const toggle = useCallback(() => {
    dispatch(toggleTheme())
  }, [dispatch])

  const set = useCallback(
    (next: Theme) => {
      dispatch(setTheme(next))
    },
    [dispatch],
  )

  return { theme, isDark: theme === 'dark', toggle, set }
}
