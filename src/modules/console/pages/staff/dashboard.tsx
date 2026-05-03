import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Lock, MessageCircle, Package, Users } from 'lucide-react'
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
import { cn } from '@/lib/utils'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function LockedCard({
  locked,
  children,
  className,
}: {
  locked: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[14px]',
        locked ? 'bg-white/70' : '',
        className,
      )}
    >
      <div
        className={cn(
          locked && 'pointer-events-none select-none blur-[6px] saturate-70 opacity-90',
        )}
      >
        {children}
      </div>
      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 shadow-sm ring-1 ring-white/25 backdrop-blur-[2px]">
            <Lock className="h-5 w-5 text-white" strokeWidth={2.2} aria-hidden />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function StaffDashboardPage() {
  const { slug = '' } = useParams({ strict: false })
  const { currentOrgId } = useCurrentOrgId()
  const { data: user } = useCurrentUser()
  const { data: stats }          = useStaffDashboardStats()
  const [itemsPage, setItemsPage] = useState(1)
  const PAGE_SIZE = 3
  const { data: recentItems }    = useStaffRecentItems(itemsPage, PAGE_SIZE)
  const { data: postStats }      = useStaffPostStats()
  const { data: breakdown }      = usePostStatusBreakdown()
  const { data: engagement }     = useStaffEngagement()

  const {
    data: orgSubscription,
    isLoading: isSubLoading,
    isError: isSubError,
  } = useOrgSubscription(currentOrgId)

  const isFreeLocked =
    !!currentOrgId && !isSubLoading && !isSubError && isOrgOnFreePlan(orgSubscription ?? null)

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
            <LockedCard locked={isFreeLocked} className="rounded-[14px]">
              <StatCard
                label="My Items in Storage"
                value={stats?.myItemsInStorage ?? '—'}
                sub={`${stats?.myItemsTotal ?? 0} total logged by me`}
                icon={Package}
                iconBg="bg-[#fff0f2]"
                iconColor="text-[#ff385c]"
              />
            </LockedCard>

            <LockedCard locked={isFreeLocked} className="rounded-[14px]">
              <StatCard
                label="Active Chats"
                value={stats?.activeChats ?? '—'}
                sub={`${stats?.queueWaiting ?? 0} in queue`}
                icon={MessageCircle}
                iconBg="bg-[#f0f4ff]"
                iconColor="text-[#2471A3]"
              />
            </LockedCard>
            <LockedCard locked={isFreeLocked} className="rounded-[14px]">
              <StatCard
                label="Returned This Week"
                value={stats?.returnedThisWeek ?? '—'}
                sub="Items handed back to owners"
                icon={Users}
                iconBg="bg-[#e8f9f0]"
                iconColor="text-[#06c167]"
              />
            </LockedCard>
          </div>

          {/* Post status breakdown + Post stats */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {breakdown ? (
                <LockedCard locked={isFreeLocked} className="rounded-[14px]">
                  <PostStatusBreakdownChart data={breakdown} />
                </LockedCard>
              ) : null}
            </div>
            {postStats ? (
              <LockedCard locked={isFreeLocked} className="rounded-[14px]">
                <PostStatsPanel data={postStats} />
              </LockedCard>
            ) : null}
          </div>

          {/* Recent items + Engagement */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LockedCard locked={isFreeLocked} className="rounded-[14px]">
              <RecentItemsPanel
                items={recentItems?.items ?? []}
                slug={slug}
                totalCount={recentItems?.totalCount ?? 0}
                page={itemsPage}
                pageSize={PAGE_SIZE}
                onPageChange={setItemsPage}
              />
            </LockedCard>
            {engagement ? (
              <LockedCard locked={isFreeLocked} className="rounded-[14px]">
                <EngagementMetricsPanel data={engagement} />
              </LockedCard>
            ) : null}
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}
