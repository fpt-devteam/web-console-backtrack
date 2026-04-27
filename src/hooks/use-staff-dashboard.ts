import { useQuery } from '@tanstack/react-query'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { mockWeeklyActivity } from '@/mock/data/mock-staff-dashboard'
import { staffDashboardService } from '@/services/staff-dashboard.service'

const STALE = 60_000

/**
 * Fetches dashboard stats by calling two real API endpoints in parallel:
 *   1. GET /api/staff/dashboard/chat-analys   → activeChats, queueWaiting
 *   2. GET /api/orgs/{orgId}/staff/dashboard/stats → item-related stats
 * Merges both payloads into the single StaffDashboardStats shape the page expects.
 */
export function useStaffDashboardStats() {
  const { currentOrgId } = useCurrentOrgId()

  const chatQuery = useQuery({
    queryKey: ['staff-dashboard', 'chat-analytics', currentOrgId],
    queryFn: () => staffDashboardService.getChatAnalytics(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })

  const itemsQuery = useQuery({
    queryKey: ['staff-dashboard', 'item-stats', currentOrgId],
    queryFn: () => staffDashboardService.getItemStats(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })

  const data =
    chatQuery.data && itemsQuery.data
      ? { ...itemsQuery.data, ...chatQuery.data }
      : undefined

  return {
    data,
    isLoading: chatQuery.isLoading || itemsQuery.isLoading,
    isError: chatQuery.isError || itemsQuery.isError,
  }
}

export function useStaffWeeklyActivity() {
  return useQuery({
    queryKey: ['staff-dashboard', 'weekly-activity'],
    queryFn: () => Promise.resolve(mockWeeklyActivity.data),
    staleTime: STALE,
  })
}

export function useStaffRecentItems(page = 1, pageSize = 3) {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'recent-items', currentOrgId, page, pageSize],
    queryFn: () => staffDashboardService.getRecentItems(currentOrgId!, page, pageSize),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useOrgReturnRate() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'org-return-rate', currentOrgId],
    queryFn: () => staffDashboardService.getOrgReturnRate(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useMyReturnRate() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'my-return-rate', currentOrgId],
    queryFn: () => staffDashboardService.getMyReturnRate(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useStaffPostStats() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'post-stats', currentOrgId],
    queryFn: () => staffDashboardService.getPostStats(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function usePostStatusBreakdown() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'post-status-breakdown', currentOrgId],
    queryFn: () => staffDashboardService.getPostStatusBreakdown(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useStaffEngagement() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['staff-dashboard', 'engagement', currentOrgId],
    queryFn: () => staffDashboardService.getEngagement(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}
