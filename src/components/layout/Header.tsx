import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setQuickAddOpen, setSearchOpen, toggleMobileSidebar } from '@/store/uiSlice'
import { logout } from '@/features/auth/authSlice'
import { ROUTES } from '@/routes/paths'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { MenuIcon, SearchIcon } from '@/components/ui/icons'

/**
 * Top application bar: mobile menu trigger, the global-search launcher,
 * a quick-add button, theme toggle, and user avatar menu.
 */
export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.currentUser)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    dispatch(logout())
    navigate(ROUTES.login, { replace: true })
  }

  function handleProfile() {
    setMenuOpen(false)
    navigate(ROUTES.profile)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={() => dispatch(toggleMobileSidebar())}
        aria-label="Open navigation"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <MenuIcon />
      </button>

      {/* Search launcher (opens the command palette). */}
      <button
        type="button"
        onClick={() => dispatch(setSearchOpen(true))}
        className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:bg-slate-100 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <SearchIcon className="h-4 w-4" />
        <span>Search…</span>
        <kbd className="ml-auto rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(setSearchOpen(true))}
          aria-label="Search"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 sm:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
        <Button size="sm" onClick={() => dispatch(setQuickAddOpen(true))}>
          + Quick Add
        </Button>
        <ThemeToggle />

        {/* User avatar dropdown */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="User menu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {user.avatarInitials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                {/* User info */}
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.5"/>
                    <path d="M5 20a7 7 0 0 1 14 0"/>
                  </svg>
                  Your profile
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
