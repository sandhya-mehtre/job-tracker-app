/**
 * Typed, validated access to environment variables.
 *
 * Reading `import.meta.env` through this module (instead of directly) keeps
 * all env access in one place and gives every consumer a strongly typed value.
 */
interface AppEnv {
  readonly appName: string
  readonly appVersion: string
  readonly storagePrefix: string
}

export const env: AppEnv = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Job Application Tracker',
  appVersion: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX ?? 'jat',
}
