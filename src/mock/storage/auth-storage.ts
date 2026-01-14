import type { AuthUser } from '@/types/auth.types';
import { MOCK_STORAGE_PREFIX } from '../config';

const KEYS = {
  AUTH_USER: `${MOCK_STORAGE_PREFIX}auth_user`,
  TEMP_EMAIL: `${MOCK_STORAGE_PREFIX}temp_email`,
} as const;

/**
 * Save authenticated user to localStorage
 */
export function saveMockAuth(user: AuthUser): void {
  try {
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save mock auth:', error);
  }
}

/**
 * Get authenticated user from localStorage
 */
export function getMockAuth(): AuthUser | null {
  try {
    const data = localStorage.getItem(KEYS.AUTH_USER);
    if (!data) return null;
    return JSON.parse(data) as AuthUser;
  } catch (error) {
    console.error('Failed to get mock auth:', error);
    return null;
  }
}

/**
 * Clear authenticated user from localStorage
 */
export function clearMockAuth(): void {
  try {
    localStorage.removeItem(KEYS.AUTH_USER);
  } catch (error) {
    console.error('Failed to clear mock auth:', error);
  }
}

/**
 * Save temporary email to sessionStorage (used in signup flow)
 */
export function saveTempEmail(email: string): void {
  try {
    sessionStorage.setItem(KEYS.TEMP_EMAIL, email);
  } catch (error) {
    console.error('Failed to save temp email:', error);
  }
}

/**
 * Get temporary email from sessionStorage
 */
export function getTempEmail(): string | null {
  try {
    return sessionStorage.getItem(KEYS.TEMP_EMAIL);
  } catch (error) {
    console.error('Failed to get temp email:', error);
    return null;
  }
}

/**
 * Clear temporary email from sessionStorage
 */
export function clearTempEmail(): void {
  try {
    sessionStorage.removeItem(KEYS.TEMP_EMAIL);
  } catch (error) {
    console.error('Failed to clear temp email:', error);
  }
}

/**
 * Clear all mock data from storage
 */
export function clearAllMockData(): void {
  clearMockAuth();
  clearTempEmail();
}

