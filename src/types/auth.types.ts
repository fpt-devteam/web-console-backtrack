import type { UserGlobalRoleType } from './user.types';

/**
 * Authenticated user data
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  globalRole: UserGlobalRoleType;
  createdAt?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials
 */
export interface SignupCredentials {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Auth error structure
 */
export interface AuthError {
  code: string;
  message: string;
}

/**
 * Email check result
 */
export interface EmailCheckResult {
  exists: boolean;
  email: string;
}

