import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfile, logout } from './authSlice'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import PageHeader from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.currentUser)

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) return null

  function handleSave(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters.')
      return
    }
    dispatch(updateProfile({ fullName: fullName.trim(), jobTitle, location, phone, bio }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    dispatch(logout())
    navigate(ROUTES.login, { replace: true })
  }

  const INPUT_CLS =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20'
  const LABEL_CLS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile" subtitle="Manage your account information" />

      {/* Avatar + identity */}
      <Card>
        <div className="flex items-center gap-5 p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
            {user.avatarInitials}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{user.fullName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            {user.jobTitle && (
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{user.jobTitle}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Edit form */}
      <Card>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Personal information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={LABEL_CLS}>
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={INPUT_CLS}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="email-display" className={LABEL_CLS}>
                Email address
              </label>
              <input
                id="email-display"
                type="email"
                value={user.email}
                disabled
                className={`${INPUT_CLS} cursor-not-allowed opacity-60`}
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className={LABEL_CLS}>
                Job title
              </label>
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={INPUT_CLS}
                placeholder="Senior BI Developer"
              />
            </div>
            <div>
              <label htmlFor="location" className={LABEL_CLS}>
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={INPUT_CLS}
                placeholder="Pune, Maharashtra"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className={LABEL_CLS}>
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={INPUT_CLS}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bio" className={LABEL_CLS}>
                Bio / About
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className={`${INPUT_CLS} resize-y`}
                placeholder="Brief description about yourself, skills, and career goals…"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit">
              {saved ? (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saved!
                </span>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Account info */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Account
          </h2>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Member since</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Danger zone
          </h2>
          {showLogoutConfirm ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-900/10">
              <p className="mb-3 text-sm text-red-700 dark:text-red-300">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Yes, sign out
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>
              Sign out
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
