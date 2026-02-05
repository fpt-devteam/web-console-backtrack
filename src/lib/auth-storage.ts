/**
 * Temporary auth storage utilities
 * Used to pass email between auth pages
 */

const TEMP_EMAIL_KEY = 'auth_temp_email';

export function saveTempEmail(email: string): void {
  sessionStorage.setItem(TEMP_EMAIL_KEY, email);
}

export function getTempEmail(): string | null {
  return sessionStorage.getItem(TEMP_EMAIL_KEY);
}

export function clearTempEmail(): void {
  sessionStorage.removeItem(TEMP_EMAIL_KEY);
}

