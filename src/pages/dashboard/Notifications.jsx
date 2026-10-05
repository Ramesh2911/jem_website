import { useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import {
  Card, Button, PageHeader, ErrorCard, LoadingRows, EmptyState,
} from '../../components/ui'
import { Hero, Ring, IconHeading, Notice } from '../../components/dashui'
import { api, errorMessage } from '../../lib/api'
import { useApi } from '../../lib/content'

const fmtDateTime = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Notifications() {
  const { data, loading, error, refetch } = useApi('/notifications')
  const [pending, setPending] = useState(null)
  const [actionError, setActionError] = useState('')

  if (loading && !data) {
    return (
      <>
        <PageHeader title="Notifications" subtitle="Updates about your loans, payments and account." />
        <LoadingRows rows={5} />
      </>
    )
  }

  if (error && !data) {
    return (
      <>
        <PageHeader title="Notifications" subtitle="Updates about your loans, payments and account." />
        <ErrorCard error={error} onRetry={refetch} />
      </>
    )
  }

  const items = (data && data.notifications) || []
  const unread = (data && data.unreadCount) || 0
  const readPct = items.length ? Math.round(((items.length - unread) / items.length) * 100) : 100

  const markRead = async (n) => {
    if (n.is_read) return
    setPending(n.id)
    setActionError('')
    try {
      await api.put(`/notifications/${n.id}/read`)
      refetch()
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setPending(null)
    }
  }

  const markAll = async () => {
    setPending('all')
    setActionError('')
    try {
      await api.put('/notifications/read-all')
      refetch()
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setPending(null)
    }
  }

  const remove = async (n) => {
    if (!window.confirm('Delete this notification?')) return
    setPending(n.id)
    setActionError('')
    try {
      await api.del(`/notifications/${n.id}`)
      refetch()
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <Hero
        eyebrow="Notifications"
        title={unread > 0 ? `${unread} unread update${unread === 1 ? '' : 's'}` : 'All caught up'}
        subtitle="Updates about your loans, payments and account — tap any item to mark it read."
        chips={[{ icon: Bell, label: `${items.length} total notification${items.length === 1 ? '' : 's'}` }]}
        right={
          <Ring
            pct={readPct}
            label="Notifications read"
            hint={unread > 0 ? `${unread} still unread` : 'Everything is read'}
          />
        }
      />

      <Notice state={{ message: actionError, error: true }} />

      <Card className="p-0 mt-6 overflow-hidden">
        <div className="px-5 sm:px-6 pt-5">
          <IconHeading
            icon={Bell}
            title="Recent activity"
            hint="Newest first"
            right={
              items.length ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAll}
                  disabled={pending === 'all' || unread === 0}
                >
                  <CheckCheck size={15} /> {pending === 'all' ? 'Marking...' : 'Mark all as read'}
                </Button>
              ) : null
            }
          />
        </div>

        {items.length ? (
          <div>
            {items.map((n, i) => (
              <div
                key={n.id}
                className={`flex items-start gap-3.5 px-5 sm:px-6 py-4 transition-colors cursor-pointer ${
                  i > 0 ? 'border-t border-navy-900/8' : ''
                } ${!n.is_read ? 'bg-green-50/60 hover:bg-green-50' : 'opacity-75 hover:opacity-100 hover:bg-navy-50/60'}`}
                onClick={() => markRead(n)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') markRead(n) }}
              >
                <span
                  className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ring-1 ${
                    n.is_read
                      ? 'bg-navy-50 text-ink-400 ring-navy-900/5'
                      : 'bg-green-600 text-white ring-green-600/30 shadow-[0_8px_18px_-10px_rgba(23,138,76,0.7)]'
                  }`}
                >
                  <Bell size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-[14.5px] text-navy-900 ${n.is_read ? 'font-medium' : 'font-bold'}`}>
                      {n.title || 'Notification'}
                    </p>
                    {!n.is_read && (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  {n.message && <p className="text-[13.5px] text-ink-600 mt-1 break-words">{n.message}</p>}
                  <p className="text-[12.5px] text-ink-400 mt-1.5">{fmtDateTime(n.created_at)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(n) }}
                  aria-label="Delete notification"
                  disabled={pending === n.id}
                  className="text-ink-400 hover:text-red-600 transition-colors disabled:opacity-50 focus-ring shrink-0 p-1.5 -m-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 sm:px-6 pb-6">
            <EmptyState title="No notifications yet" hint="Loan, payment and account updates will appear here." />
          </div>
        )}
      </Card>
    </>
  )
}
