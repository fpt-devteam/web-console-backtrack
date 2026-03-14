/**
 * Temporary auth storage utilities
 * Used to pass email and invitation code between auth pages
 */

const TEMP_EMAIL_KEY = 'auth_temp_email';
const INVITATION_CODE_KEY = 'backtrack_invitation_code';

export function saveTempEmail(email: string): void {
  sessionStorage.setItem(TEMP_EMAIL_KEY, email);
}

export function getTempEmail(): string | null {
  return sessionStorage.getItem(TEMP_EMAIL_KEY);
}

export function clearTempEmail(): void {
  sessionStorage.removeItem(TEMP_EMAIL_KEY);
}

export function saveInvitationCode(code: string): void {
  sessionStorage.setItem(INVITATION_CODE_KEY, code);
}

export function getInvitationCode(): string | null {
  return sessionStorage.getItem(INVITATION_CODE_KEY);
}

export function clearInvitationCode(): void {
  sessionStorage.removeItem(INVITATION_CODE_KEY);
}

