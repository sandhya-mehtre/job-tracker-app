/**
 * Centralized route path constants. Import these instead of hardcoding
 * string literals so routes stay refactor-safe across the app.
 */
export const ROUTES = {
  // Auth routes
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  // App routes
  dashboard: '/',
  applications: '/applications',
  applicationDetails: '/applications/:id',
  kanban: '/kanban',
  companies: '/companies',
  contacts: '/contacts',
  interviews: '/interviews',
  analytics: '/analytics',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/** Build the details path for a specific application id. */
export const applicationDetailsPath = (id: string): string =>
  ROUTES.applicationDetails.replace(':id', id)
