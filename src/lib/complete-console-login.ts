import { getInvitationCode } from '@/lib/auth-storage';
import { showToast } from '@/lib/toast';
import { authService } from '@/services';
import { userService } from '@/services/user.service';
import type { AuthUser } from '@/types/auth.types';
import { UserGlobalRole } from '@/types/user.types';

export function toFriendlyAuthErrorMessage(message: unknown): string {
  const raw = typeof message === 'string' ? message.trim() : '';
  if (!raw) return 'Unable to sign in. Please try again.';

  const lower = raw.toLowerCase();

  if (
    lower.includes('firebase') ||
    lower.includes('auth/') ||
    lower.includes('stack') ||
    lower.includes('exception')
  ) {
    return 'Unable to sign in. Please check your email and password and try again.';
  }

  if (lower.includes('network') || lower.includes('timeout') || lower.includes('failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (lower.includes('popup')) {
    return 'Sign-in was cancelled or blocked. Please try again.';
  }

  return raw;
}

/**
 * After Firebase auth succeeds: require verified email, upsert profile, redirect into console.
 * @returns whether session was finalized (false = signed out, caller should show unverified message)
 */
export async function completeConsoleLogin(user: AuthUser): Promise<boolean> {
  if (!user.emailVerified) {
    await authService.signOut();
    return false;
  }

  const upsertedProfile = await userService.upsertUser();
  showToast.success('Welcome back!');

  const invitationCode = getInvitationCode();

  if (upsertedProfile.globalRole === UserGlobalRole.SUPER_ADMIN) {
    window.location.href = '/super-admin/dashboard';
    return true;
  }

  if (invitationCode) {
    window.location.href = '/console/join-invitation';
  } else {
    window.location.href = '/console/welcome';
  }
  return true;
}
