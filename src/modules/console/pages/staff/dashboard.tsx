import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { MessageCircle, Package, Users } from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import { EngagementMetricsPanel } from '../../components/staff/dashboard/engagement-metrics'
import { PostStatusBreakdownChart } from '../../components/staff/dashboard/post-status-breakdown-chart'
import { PostStatsPanel } from '../../components/staff/dashboard/post-stats-panel'
import { RecentItemsPanel } from '../../components/staff/dashboard/recent-items-panel'
import { StatCard } from '../../components/staff/dashboard/stat-card'
import { useCurrentUser } from '@/hooks/use-auth'
import {
  usePostStatusBreakdown,
  useStaffDashboardStats,
  useStaffEngagement,
  useStaffPostStats,
  useStaffRecentItems,
} from '@/hooks/use-staff-dashboard'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { isOrgOnFreePlan, useOrgSubscription } from '@/hooks/use-org-subscription'
import { StaffDashboardMockPage } from './dashboard-mock'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function StaffDashboardPage() {
  const { slug = '' } = useParams({ strict: false })
  const { currentOrgId } = useCurrentOrgId()
  const { data: user } = useCurrentUser()

  const [itemsPage, setItemsPage] = useState(1)
  const PAGE_SIZE = 3
  const { data: stats } = useStaffDashboardStats()
  const { data: recentItems } = useStaffRecentItems(itemsPage, PAGE_SIZE)
  const { data: postStats } = useStaffPostStats()
  const { data: breakdown } = usePostStatusBreakdown()
  const { data: engagement } = useStaffEngagement()

  const {
    data: orgSubscription,
    isLoading: isSubLoading,
    isError: isSubError,
  } = useOrgSubscription(currentOrgId)

  const isFreeOrg = !!currentOrgId && !isSubLoading && isOrgOnFreePlan(orgSubscription ?? null)

  // If we can't resolve subscription, fall back to mock dashboard instead of crashing the page.
  if (isSubError || isFreeOrg) {
    return <StaffDashboardMockPage />
  }

  if (!currentOrgId || isSubLoading) {
    return (
      <StaffLayout>
        <div className="h-full overflow-y-auto bg-[#f7f7f7] p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="h-10 w-64 rounded-xl bg-white border border-[#dddddd] animate-pulse" />
            <div className="h-5 w-80 rounded-xl bg-white border border-[#dddddd] animate-pulse" />
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 h-[280px] bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
              <div className="h-[280px] bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="h-64 bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
              <div className="h-64 bg-white rounded-2xl border border-[#dddddd] animate-pulse" />
            </div>
          </div>
        </div>
      </StaffLayout>
    )
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto bg-[#f7f7f7] p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header + quick actions */}
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

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
            <StatCard
              label="My Items in Storage"
              value={stats?.myItemsInStorage ?? '—'}
              sub={`${stats?.myItemsTotal ?? 0} total logged by me`}
              icon={Package}
              iconBg="bg-[#fff0f2]"
              iconColor="text-[#ff385c]"
            />

            <StatCard
              label="Active Chats"
              value={stats?.activeChats ?? '—'}
              sub={`${stats?.queueWaiting ?? 0} in queue`}
              icon={MessageCircle}
              iconBg="bg-[#f0f4ff]"
              iconColor="text-[#2471A3]"
            />
            <StatCard
              label="Returned This Week"
              value={stats?.returnedThisWeek ?? '—'}
              sub="Items handed back to owners"
              icon={Users}
              iconBg="bg-[#e8f9f0]"
              iconColor="text-[#06c167]"
            />
          </div>

          {/* Post status breakdown + Post stats */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {breakdown ? (
                <PostStatusBreakdownChart data={breakdown} />
              ) : null}
            </div>
            {postStats ? (
              <PostStatsPanel data={postStats} />
            ) : null}
          </div>

          {/* Recent items + Engagement */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentItemsPanel
              items={recentItems?.items ?? []}
              slug={slug}
              totalCount={recentItems?.totalCount ?? 0}
              page={itemsPage}
              pageSize={PAGE_SIZE}
              onPageChange={setItemsPage}
            />
            {engagement ? (
              <EngagementMetricsPanel data={engagement} />
            ) : null}
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}
