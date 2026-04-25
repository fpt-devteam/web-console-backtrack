import { StaffLayout } from '../../components/staff/layout'
import { useMemo, useState } from 'react'
import { CheckCheck } from 'lucide-react'

type NotificationKind = 'inventory' | 'handover' | 'return' | 'account' | 'system'

type StaffNotification = {
  id: string
  kind: NotificationKind
  title: string
  message: string
  /** for grouping: 0=today, 1=yesterday, 2+=older */
  daysAgo: number
  timeLabel: string
  isUnread: boolean
}

const HARD_CODED_NOTIFICATIONS: StaffNotification[] = [
  {
    id: 'n_001',
    kind: 'inventory',
    title: 'New found item added',
    message: 'A new item was added to inventory and is waiting for review.',
    daysAgo: 0,
    timeLabel: 'Just now',
    isUnread: true,
  },
  {
    id: 'n_002',
    kind: 'handover',
    title: 'Handover scheduled',
    message: 'Handover was scheduled for today at 16:00. Please prepare the item.',
    daysAgo: 0,
    timeLabel: '2h ago',
    isUnread: true,
  },
  {
    id: 'n_003',
    kind: 'return',
    title: 'Return deadline approaching',
    message: 'An item in storage will expire in 2 days. Check the return plan.',
    daysAgo: 1,
    timeLabel: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'n_004',
    kind: 'account',
    title: 'Welcome aboard',
    message: 'Your staff account is ready. You can start managing found items now.',
    daysAgo: 3,
    timeLabel: '3 days ago',
    isUnread: false,
  },
  {
    id: 'n_005',
    kind: 'system',
    title: 'Maintenance window',
    message: 'System maintenance is scheduled for Sunday 01:00–02:00. Some actions may be unavailable.',
    daysAgo: 7,
    timeLabel: '1 week ago',
    isUnread: false,
  },
]

export function StaffNotificationPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All')
  const [unreadIds, setUnreadIds] = useState(() => new Set(HARD_CODED_NOTIFICATIONS.filter((n) => n.isUnread).map((n) => n.id)))

  const items = useMemo(() => {
    const normalized = HARD_CODED_NOTIFICATIONS.map((n) => ({ ...n, isUnread: unreadIds.has(n.id) }))
    if (activeTab === 'Unread') return normalized.filter((n) => n.isUnread)
    return normalized
  }, [activeTab, unreadIds])

  const groups = useMemo(() => {
    const g = {
      today: [] as StaffNotification[],
      yesterday: [] as StaffNotification[],
      older: [] as StaffNotification[],
    }
    for (const n of items) {
      if (n.daysAgo === 0) g.today.push(n)
      else if (n.daysAgo === 1) g.yesterday.push(n)
      else g.older.push(n)
    }
    return g
  }, [items])

  const unreadCount = unreadIds.size

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Notifications</h1>
        </div>

        <div className="bg-white rounded-[14px] border border-[#dddddd] flex-1 min-h-0 flex flex-col">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 border-b border-[#dddddd] flex items-end justify-between gap-3">
            <div className="flex items-end gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('All')}
                className={[
                  'pb-3 text-sm font-medium transition-colors',
                  activeTab === 'All'
                    ? 'text-[#222222] font-black border-b-2 border-[#222222]'
                    : 'text-[#6a6a6a] hover:text-[#222222] border-b-2 border-transparent',
                ].join(' ')}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('Unread')}
                className={[
                  'pb-3 text-sm font-medium transition-colors',
                  activeTab === 'Unread'
                    ? 'text-[#222222] font-black border-b-2 border-[#222222]'
                    : 'text-[#6a6a6a] hover:text-[#222222] border-b-2 border-transparent',
                ].join(' ')}
              >
                Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
              </button>
            </div>

            <button
              type="button"
              className={[
                'mb-2 me-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6a6a6a] transition-colors',
                'hover:text-[#222222] hover:scale-[1.03] transform-gpu origin-right transition-transform',
                'disabled:opacity-50 disabled:pointer-events-none',
              ].join(' ')}
              onClick={() => setUnreadIds(new Set())}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-5">
            {items.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6a6a6a]">
                No notifications.
              </div>
            ) : (
              <div className="space-y-6">
                {([
                  { key: 'today' as const, title: 'Today', items: groups.today },
                  { key: 'yesterday' as const, title: 'Yesterday', items: groups.yesterday },
                  { key: 'older' as const, title: 'Older', items: groups.older },
                ]).map((section) => {
                  if (section.items.length === 0) return null
                  return (
                    <div key={section.key}>
                        <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-[#222222]">{section.title}</div>
                      </div>

                      <div className="space-y-3">
                        {section.items.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              setUnreadIds((prev) => {
                                if (!prev.has(n.id)) return prev
                                const next = new Set(prev)
                                next.delete(n.id)
                                return next
                              })
                            }}
                            className={[
                              'w-full text-left rounded-[12px] border border-[#dddddd] px-4 py-3 sm:px-5 sm:py-3.5 transition-colors',
                              n.isUnread
                                ? 'bg-[#fff0f2]/40 hover:bg-[#fff0f2]/60'
                                : 'bg-[#f7f7f7] hover:bg-[#f7f7f7]/80',
                            ].join(' ')}
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1.5">
                                <div
                                  className={[
                                    'h-2.5 w-2.5 rounded-full',
                                    n.isUnread ? 'bg-[#ff385c]' : 'bg-[#dddddd]',
                                  ].join(' ')}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="font-semibold text-[#222222] truncate">{n.title}</div>
                                  </div>
                                  <div className="text-xs text-[#929292] shrink-0">{n.timeLabel}</div>
                                </div>
                                <div className="mt-1 text-sm text-[#6a6a6a]">{n.message}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

