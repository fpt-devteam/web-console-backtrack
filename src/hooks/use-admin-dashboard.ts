import { useQuery } from '@tanstack/react-query'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { adminDashboardService } from '@/services/admin-dashboard.service'

const STALE = 60_000

export function useAdminDashboardStats() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'stats', currentOrgId],
    queryFn: () => adminDashboardService.getStats(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useAdminMonthlyActivity() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'monthly-activity', currentOrgId],
    queryFn: () => adminDashboardService.getMonthlyActivity(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useAdminStaffPerformance() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'staff-performance', currentOrgId],
    queryFn: () => adminDashboardService.getStaffPerformance(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useAdminCategoryBreakdown() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'category-breakdown', currentOrgId],
    queryFn: () => adminDashboardService.getCategoryBreakdown(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useAdminOrgReturnRate() {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'org-return-rate', currentOrgId],
    queryFn: () => adminDashboardService.getOrgReturnRate(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}

export function useAdminRecentInventory(page = 1, pageSize = 3) {
  const { currentOrgId } = useCurrentOrgId()
  return useQuery({
    queryKey: ['admin-dashboard', 'recent-inventory', currentOrgId, page, pageSize],
    queryFn: () => adminDashboardService.getRecentInventory(currentOrgId!, page, pageSize),
    enabled: !!currentOrgId,
    staleTime: STALE,
  })
}
