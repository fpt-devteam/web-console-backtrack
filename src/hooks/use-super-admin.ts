import { useQuery } from '@tanstack/react-query';
import type {OrgListParams} from '@/services/super-admin.service';
import {  superAdminService } from '@/services/super-admin.service';
import { adminOrgService } from '@/services/admin-org.service';

export const SUPER_ADMIN_KEYS = {
  kpi: ['super-admin', 'kpi'] as const,
  postMonthly: ['super-admin', 'post-monthly'] as const,
  recentActivity: (params?: { status?: string; limit?: number }) =>
    ['super-admin', 'recent-activity', params] as const,
  organizations: (params?: OrgListParams) =>
    ['super-admin', 'organizations', params] as const,
  orgDetail: (orgId: string, params?: { billingPage?: number; billingPageSize?: number }) =>
    ['super-admin', 'org-detail', orgId, params] as const,
};

export function useSuperAdminKpi() {
  return useQuery({
    queryKey: SUPER_ADMIN_KEYS.kpi,
    queryFn: () => superAdminService.getDashboardKpi(),
  });
}

export function useSuperAdminPostMonthly() {
  return useQuery({
    queryKey: SUPER_ADMIN_KEYS.postMonthly,
    queryFn: () => superAdminService.getPostMonthly(),
  });
}

export function useSuperAdminRecentActivity(params?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: SUPER_ADMIN_KEYS.recentActivity(params),
    queryFn: () => superAdminService.getRecentActivity(params),
  });
}

export function useSuperAdminOrganizations(params?: OrgListParams) {
  return useQuery({
    queryKey: SUPER_ADMIN_KEYS.organizations(params),
    queryFn: () => superAdminService.getOrganizations(params),
  });
}

export function useSuperAdminOrgDetail(
  orgId: string | null | undefined,
  params?: { billingPage?: number; billingPageSize?: number },
) {
  return useQuery({
    queryKey: SUPER_ADMIN_KEYS.orgDetail(orgId ?? 'unknown', params),
    queryFn: () => adminOrgService.getOrgById(orgId!, params),
    enabled: Boolean(orgId),
  })
}
