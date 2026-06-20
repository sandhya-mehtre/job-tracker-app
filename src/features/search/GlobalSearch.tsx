import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSearchOpen } from '@/store/uiSlice'
import { SearchIcon } from '@/components/ui/icons'
import { useGlobalSearch, type SearchGroup, type SearchResult } from './useGlobalSearch'

const GROUP_ORDER: SearchGroup[] = [
  'Applications',
  'Companies',
  'Contacts',
  'Interviews',
]

export default function GlobalSearch() {
  const open = useAppSelector((s) => s.ui.searchOpen)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')

  const results = useGlobalSearch(term)

  const close = () => {
    setTerm('')
    dispatch(setSearchOpen(false))
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTerm('')
        dispatch(setSearchOpen(false))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dispatch])

  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, SearchResult[]>()
    for (const r of results) {
      const list = map.get(r.group) ?? []
      list.push(r)
      map.set(r.group, list)
    }
    return map
  }, [results])

  const go = (to: string) => {
    close()
    navigate(to)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center p-4 pt-[10vh]">
          <motion.div
            className="fixed inset-0 bg-slate-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
              <SearchIcon className="h-5 w-5 text-slate-400" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search applications, companies, contacts…"
                className="h-12 w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {term.trim() === '' ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  Type to search across everything.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  No results for “{term}”.
                </p>
              ) : (
                GROUP_ORDER.filter((g) => grouped.has(g)).map((group) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {group}
                    </p>
                    {grouped.get(group)!.map((r) => (
                      <button
                        key={`${r.group}-${r.id}`}
                        type="button"
                        onClick={() => go(r.to)}
                        className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {r.title}
                        </span>
                        <span className="text-xs text-slate-400">{r.subtitle}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
