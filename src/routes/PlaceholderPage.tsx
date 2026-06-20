interface PlaceholderPageProps {
  title: string
}

/**
 * Temporary page used while real feature pages are built in later tasks.
 * Each route renders this so navigation can be verified end-to-end now.
 */
export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This page is coming soon.
      </p>
    </section>
  )
}
