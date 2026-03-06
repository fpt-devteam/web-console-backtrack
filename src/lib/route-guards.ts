import { redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import { orgService } from '@/services/org.service';
import { UserGlobalRole } from '@/types/user.types';

const AUTH_CURRENT_USER_KEY = ['auth', 'currentUser'] as const;
const ORG_MY_ORGS_KEY = ['orgs', 'me'] as const;

function getCurrentOrgIdFromSession(): string | null {
  try {
    return sessionStorage.getItem('backtrack_current_org_id');
  } catch {
    return null;
  }
}

export async function requireSignedIn(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData({
    queryKey: AUTH_CURRENT_USER_KEY,
    queryFn: () => authService.getCurrentUser(),
  });

  if (!user) {
    throw redirect({ to: '/auth/signin' });
  }

  return user;
}

export async function requireSuperAdmin(queryClient: QueryClient) {
  const user = await requireSignedIn(queryClient);

  if (user.globalRole !== UserGlobalRole.SUPER_ADMIN) {
    throw new Error('FORBIDDEN_SUPER_ADMIN');
  }

  return user;
}

export async function requireOrgMember(queryClient: QueryClient) {
  await requireSignedIn(queryClient);

  const myOrgs = await queryClient.ensureQueryData({
    queryKey: ORG_MY_ORGS_KEY,
    queryFn: () => orgService.getMyOrgs(),
  });

  const currentOrgId = getCurrentOrgIdFromSession();
  const activeOrg = (currentOrgId ? myOrgs.find((o) => o.orgId === currentOrgId) : null) ?? myOrgs[0];

  if (!activeOrg) {
    throw new Error('NO_ACTIVE_ORG');
  }

  return activeOrg;
}

export async function requireOrgAdmin(queryClient: QueryClient) {
  const activeOrg = await requireOrgMember(queryClient);

  if (activeOrg.myRole !== 'OrgAdmin') {
    throw new Error('FORBIDDEN_ORG_ADMIN');
  }

  return activeOrg;
}

export async function requireOrgStaff(queryClient: QueryClient) {
  const activeOrg = await requireOrgMember(queryClient);

  if (activeOrg.myRole !== 'OrgStaff') {
    // Admin (hoặc role khác) không được vào portal staff
    throw new Error('FORBIDDEN_ORG_STAFF');
  }

  return activeOrg;
}

