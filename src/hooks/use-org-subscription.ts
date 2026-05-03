import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import type { AdminSubscriptionResult } from '@/types/admin-user.types'

const STALE_MS = 60_000

/** True when org has no paid subscription (API returns null, $0 plan, or plan name contains “free”). */
export function isOrgOnFreePlan(sub: AdminSubscriptionResult | null | undefined): boolean {
  if (sub == null) return true
  const name = sub.planSnapshot?.name?.trim() ?? ''
  if (/free/i.test(name)) return true
  const price = sub.planSnapshot?.price
  if (price == null || Number(price) <= 0) return true
  return false
}

export function useOrgSubscription(orgId: string | null) {
  return useQuery({
    queryKey: ['subscription', 'org', orgId],
    queryFn: () => subscriptionService.getOrgSubscription(orgId!),
    enabled: !!orgId,
    staleTime: STALE_MS,
  })
}
