import { redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { setActiveOrgId } from '@/lib/api-client';
import { authService } from '@/services';
import { orgService } from '@/services/org.service';
import { UserGlobalRole } from '@/types/user.types';

const AUTH_CURRENT_USER_KEY = ['auth', 'currentUser'] as const;
const ORG_MY_ORGS_KEY = ['orgs', 'me'] as const;

/** Same key as `CurrentOrgProvider` — session must be set before nested `beforeLoad` runs. */
const SESSION_ORG_ID_KEY = 'backtrack_current_org_id';

function getCurrentOrgIdFromSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_ORG_ID_KEY);
  } catch {
    return null;
  }
}

/** Persist org id for route guards + Axios interceptor before child routes' `beforeLoad` runs. */
export function persistActiveOrgIdForSession(orgId: string): void {
  try {
    sessionStorage.setItem(SESSION_ORG_ID_KEY, orgId);
  } catch {
    /* ignore */
  }
  setActiveOrgId(orgId);
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

  if (!currentOrgId) {
    if (myOrgs.length === 0) {
      throw redirect({ to: '/console/create-organization' });
    }
    throw redirect({ to: '/console/welcome' });
  }

  const activeOrg = myOrgs.find((o) => o.orgId === currentOrgId);

  if (!activeOrg) {
    throw new Error('FORBIDDEN_ORG_NOT_MEMBER');
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

  // Both OrgStaff and OrgAdmin can access the staff portal
  if (activeOrg.myRole !== 'OrgStaff' && activeOrg.myRole !== 'OrgAdmin') {
    throw new Error('FORBIDDEN_ORG_STAFF');
  }

  return activeOrg;
}

