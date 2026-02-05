import type { UserGlobalRoleType } from './user.types';

/**
 * Authenticated user data
 */
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  globalRole: UserGlobalRoleType;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
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
  name?: string;
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

