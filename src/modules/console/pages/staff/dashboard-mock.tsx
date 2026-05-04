import { useMemo, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { MessageCircle, Package, Users, Info } from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import { EngagementMetricsPanel } from '../../components/staff/dashboard/engagement-metrics'
import { PostStatusBreakdownChart } from '../../components/staff/dashboard/post-status-breakdown-chart'
import { PostStatsPanel } from '../../components/staff/dashboard/post-stats-panel'
import { RecentItemsPanel } from '../../components/staff/dashboard/recent-items-panel'
import { StatCard } from '../../components/staff/dashboard/stat-card'
import { useCurrentUser } from '@/hooks/use-auth'
import type { DashboardInventoryItem, PostStatusBreakdown, PostStatsResponse, EngagementMetrics } from '@/services/staff-dashboard.service'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function StaffDashboardNoticeBanner() {
  return (
    <div className="rounded-2xl border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        <Info className="mt-1 w-4 h-4 flex-shrink-0 text-[#dc2626]" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#222222] leading-none uppercase">Notice</div>
          <div className="mt-1 text-sm text-[#6a6a6a] leading-relaxed">
            Your organization is currently on the Free plan. This dashboard is shown with example data for preview purposes.
          </div>
        </div>
      </div>
    </div>
  )
}

function buildMockBreakdown(): PostStatusBreakdown {
  return {
    org: {
      lost: { total: 40, statuses: [] },
      found: {
        total: 260,
        statuses: [
          { status: 'InStorage', count: 120, pct: 46 },
          { status: 'Returned', count: 95, pct: 37 },
          { status: 'Archived', count: 25, pct: 10 },
          { status: 'Expired', count: 20, pct: 7 },
        ],
      },
    },
    mine: {
      lost: { total: 6, statuses: [] },
      found: {
        total: 34,
        statuses: [
          { status: 'InStorage', count: 16, pct: 47 },
          { status: 'Returned', count: 12, pct: 35 },
          { status: 'Archived', count: 4, pct: 12 },
          { status: 'Expired', count: 2, pct: 6 },
        ],
      },
    },
  }
}

const MOCK_POST_STATS: PostStatsResponse = {
  lostPosts: 6,
  foundPosts: 34,
  total: 40,
  thisMonth: { lost: 2, found: 9 },
}

const MOCK_ENGAGEMENT: EngagementMetrics = {
  score: 82,
  rank: 'Top Performer',
  itemsThisMonth: 18,
  avgItemsPerDay: 2.3,
  weekActivity: [true, true, false, true, true, false, true],
  streak: 5,
}

const MOCK_RECENT_ITEMS: DashboardInventoryItem[] = [
  {
    id: 'mock-1',
    postTitle: 'Blue Backpack',
    category: 'PersonalBelongings',
    subcategoryName: 'Bags',
    status: 'InStorage',
    organizationStorageLocation: 'Shelf A-01',
    imageUrl: null,
    createdAt: '2026-05-01T09:14:00Z',
  },
  {
    id: 'mock-2',
    postTitle: 'Student ID Card',
    category: 'Cards',
    subcategoryName: 'Student ID',
    status: 'Returned',
    organizationStorageLocation: 'Shelf B-02',
    imageUrl: null,
    createdAt: '2026-04-29T14:32:00Z',
  },
  {
    id: 'mock-3',
    postTitle: 'iPhone 14',
    category: 'Electronics',
    subcategoryName: 'Phone',
    status: 'Active',
    organizationStorageLocation: 'Counter 1',
    imageUrl: null,
    createdAt: '2026-04-27T11:05:00Z',
  },
  {
    id: 'mock-4',
    postTitle: 'Leather Wallet',
    category: 'PersonalBelongings',
    subcategoryName: 'Wallet',
    status: 'InStorage',
    organizationStorageLocation: 'Shelf A-03',
    imageUrl: null,
    createdAt: '2026-04-26T16:20:00Z',
  },
  {
    id: 'mock-5',
    postTitle: 'AirPods',
    category: 'Electronics',
    subcategoryName: 'Earphones',
    status: 'ReturnScheduled',
    organizationStorageLocation: 'Drawer C-01',
    imageUrl: null,
    createdAt: '2026-04-25T10:45:00Z',
  },
]

export function StaffDashboardMockPage() {
  const { slug = '' } = useParams({ strict: false })
  const { data: user } = useCurrentUser()
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  const stats = useMemo(
    () => ({
      myItemsInStorage: 16,
      myItemsTotal: 34,
      activeChats: 4,
      queueWaiting: 2,
      pendingReturns: 3,
      returnedThisWeek: 7,
    }),
    [],
  )

  const breakdown = useMemo(() => buildMockBreakdown(), [])

  const [itemsPage, setItemsPage] = useState(1)
  const PAGE_SIZE = 3
  const totalCount = MOCK_RECENT_ITEMS.length
  const pageItems = useMemo(() => {
    const start = (itemsPage - 1) * PAGE_SIZE
    return MOCK_RECENT_ITEMS.slice(start, start + PAGE_SIZE)
  }, [itemsPage])

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto bg-[#f7f7f7] p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#222222]">
                {greeting()}, {firstName} 👋
              </h1>
              <p className="mt-0.5 text-sm text-[#929292]">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <StaffDashboardNoticeBanner />

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
            <StatCard
              label="My Items in Storage"
              value={stats.myItemsInStorage}
              sub={`${stats.myItemsTotal} total logged by me`}
              icon={Package}
              iconBg="bg-[#fff0f2]"
              iconColor="text-[#ff385c]"
            />

            <StatCard
              label="Active Chats"
              value={stats.activeChats}
              sub={`${stats.queueWaiting} in queue`}
              icon={MessageCircle}
              iconBg="bg-[#f0f4ff]"
              iconColor="text-[#2471A3]"
            />
            <StatCard
              label="Returned This Week"
              value={stats.returnedThisWeek}
              sub="Items handed back to owners"
              icon={Users}
              iconBg="bg-[#e8f9f0]"
              iconColor="text-[#06c167]"
            />
          </div>

          {/* Post status breakdown + Post stats */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PostStatusBreakdownChart data={breakdown} />
            </div>
            <PostStatsPanel data={MOCK_POST_STATS} />
          </div>

          {/* Recent items + Engagement */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentItemsPanel
              items={pageItems}
              slug={slug}
              totalCount={totalCount}
              page={itemsPage}
              pageSize={PAGE_SIZE}
              onPageChange={setItemsPage}
            />
            <EngagementMetricsPanel data={MOCK_ENGAGEMENT} />
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

