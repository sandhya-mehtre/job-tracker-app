import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/routes/paths'
import { formatDate, formatDateTime } from '@/lib/utils'
import ApplicationFormModal from './ApplicationFormModal'
import { removeApplication } from './applicationsSlice'
import { JOB_TYPE_LABELS, SOURCE_LABELS, WORK_MODE_LABELS } from './constants'
import InterviewFormModal from '@/features/interviews/InterviewFormModal'

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()

  const application = useAppSelector((s) =>
    s.applications.items.find((a) => a.id === id),
  )
  const allInterviews = useAppSelector((s) => s.interviews.items)
  const interviews = useMemo(
    () =>
      allInterviews
        .filter((i) => i.applicationId === id)
        .sort(
          (a, b) =>
            new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
        ),
    [allInterviews, id],
  )

  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [scheduling, setScheduling] = useState(false)

  if (!application) {
    return (
      <div>
        <PageHeader title="Application" />
        <Card className="p-10">
          <EmptyState
            title="Application not found"
            description="It may have been deleted."
            action={
              <Link to={ROUTES.applications} className="text-sm text-indigo-600">
                Back to Applications
              </Link>
            }
          />
        </Card>
      </div>
    )
  }

  const handleDelete = () => {
    dispatch(removeApplication(application.id))
    toast.info('Application deleted')
    navigate(ROUTES.applications)
  }

  const details: { label: string; value: string }[] = [
    { label: 'Company', value: application.companyName },
    { label: 'Job Type', value: JOB_TYPE_LABELS[application.jobType] },
    { label: 'Work Mode', value: WORK_MODE_LABELS[application.workMode] },
    { label: 'Source', value: SOURCE_LABELS[application.source] },
    { label: 'Location', value: application.location || '—' },
    { label: 'Salary Range', value: application.salaryRange || '—' },
    { label: 'Applied Date', value: formatDate(application.appliedDate) },
    { label: 'Last Updated', value: formatDate(application.updatedAt) },
  ]

  return (
    <div>
      <Link
        to={ROUTES.applications}
        className="mb-3 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-300"
      >
        ← Back to Applications
      </Link>

      <PageHeader
        title={application.jobTitle}
        subtitle={application.companyName}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Details"
            action={<StatusBadge status={application.status} />}
          />
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 p-5 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  {d.label}
                </dt>
                <dd className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">
                  {d.value}
                </dd>
              </div>
            ))}
            {application.jobUrl && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Job Posting
                </dt>
                <dd className="mt-0.5 text-sm">
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    {application.jobUrl}
                  </a>
                </dd>
              </div>
            )}
            {application.notes && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Notes
                </dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                  {application.notes}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <Card>
          <CardHeader
            title={`Interviews (${interviews.length})`}
            action={
              <Button size="sm" variant="secondary" onClick={() => setScheduling(true)}>
                Schedule
              </Button>
            }
          />
          <div className="p-2">
            {interviews.length === 0 ? (
              <EmptyState title="No interviews scheduled" />
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {interviews.map((interview) => (
                  <li key={interview.id} className="px-3 py-3">
                    <p className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
                      {interview.type.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(interview.scheduledAt)} · {interview.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <ApplicationFormModal
        open={editing}
        application={application}
        onClose={() => setEditing(false)}
      />

      <InterviewFormModal
        open={scheduling}
        defaultApplicationId={application.id}
        onClose={() => setScheduling(false)}
      />

      <ConfirmDialog
        open={confirming}
        title="Delete application"
        message={`Delete "${application.jobTitle}" at ${application.companyName}? This can't be undone.`}
        onConfirm={handleDelete}
        onClose={() => setConfirming(false)}
      />
    </div>
  )
}
