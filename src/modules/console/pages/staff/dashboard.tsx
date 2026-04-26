import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { MessageCircle, Package, Users } from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import { ActivityChart } from '../../components/staff/dashboard/activity-chart'
import { EngagementMetricsPanel } from '../../components/staff/dashboard/engagement-metrics'
import { PostStatsPanel } from '../../components/staff/dashboard/post-stats-panel'
import { RecentItemsPanel } from '../../components/staff/dashboard/recent-items-panel'
import { ReturnRateChart } from '../../components/staff/dashboard/return-rate-chart'
import { StatCard } from '../../components/staff/dashboard/stat-card'
import { useCurrentUser } from '@/hooks/use-auth'
import {
  useMyReturnRate,
  useOrgReturnRate,
  useStaffDashboardStats,
  useStaffEngagement,
  useStaffPostStats,
  useStaffRecentItems,
  useStaffWeeklyActivity,
} from '@/hooks/use-staff-dashboard'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function StaffDashboardPage() {
  const { slug = '' } = useParams({ strict: false })
  const { data: user } = useCurrentUser()
  const { data: stats }       = useStaffDashboardStats()
  const { data: weekly }      = useStaffWeeklyActivity()
  const [itemsPage, setItemsPage] = useState(1)
  const PAGE_SIZE = 3
  const { data: recentItems } = useStaffRecentItems(itemsPage, PAGE_SIZE)
  const { data: orgRate }     = useOrgReturnRate()
  const { data: myRate }      = useMyReturnRate()
  const { data: postStats }   = useStaffPostStats()
  const { data: engagement }  = useStaffEngagement()

  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto bg-[#f7f7f7] p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header + quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#222222]">
              {greeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-[#929292] mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
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

        {/* Activity chart + Post stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ActivityChart data={weekly ?? []} />
          </div>
          {postStats && <PostStatsPanel data={postStats} />}
        </div>

        {/* Return rate charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orgRate && (
            <ReturnRateChart
              title="Organization Return Rate"
              subtitle="All items ever logged by the org"
              data={orgRate}
            />
          )}
          {myRate && (
            <ReturnRateChart
              title="My Return Rate"
              subtitle="Items I personally logged"
              data={myRate}
            />
          )}
        </div>

        {/* Recent items + Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentItemsPanel
            items={recentItems?.items ?? []}
            slug={slug}
            totalCount={recentItems?.totalCount ?? 0}
            page={itemsPage}
            pageSize={PAGE_SIZE}
            onPageChange={setItemsPage}
          />
          {engagement && <EngagementMetricsPanel data={engagement} />}
        </div>

      </div>
    </StaffLayout>
  )
}
