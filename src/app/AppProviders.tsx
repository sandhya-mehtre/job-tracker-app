import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { useTheme } from '@/hooks/useTheme'

/** Applies the active theme to <html> for the whole app. */
function ThemeGate({ children }: { children: ReactNode }) {
  useTheme()
  return <>{children}</>
}

/** Composes all global providers around the app tree. */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeGate>{children}</ThemeGate>
    </Provider>
  )
}
