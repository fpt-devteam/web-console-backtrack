import type { AuthUser, LoginCredentials, SignupCredentials, EmailCheckResult } from '@/types/auth.types';

/**
 * Authentication Service Interface
 * 
 * Both mock and real implementations must conform to this interface.
 * This ensures type safety and makes switching between implementations seamless.
 */
export interface IAuthService {
  /**
   * Check if an email already exists in the system
   */
  checkEmailExists(email: string): Promise<EmailCheckResult>;

  /**
   * Sign in with email and password
   * @throws {AuthError} When credentials are invalid
   */
  signIn(credentials: LoginCredentials): Promise<AuthUser>;

  /**
   * Sign in with Google (Firebase popup).
   */
  signInWithGoogle(): Promise<AuthUser>;

  /**
   * Sign up with email and password
   * @throws {AuthError} When signup fails
   */
  signUp(credentials: SignupCredentials): Promise<AuthUser>;

  /**
   * Send email verification to current user
   */
  sendVerificationEmail(): Promise<void>;

  /**
   * Get the currently authenticated user
   * @returns {AuthUser | null} User if authenticated, null otherwise
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;
}

