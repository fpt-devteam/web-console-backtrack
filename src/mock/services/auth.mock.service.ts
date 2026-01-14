import type { IAuthService } from '@/services/auth.service.interface';
import type { AuthUser, LoginCredentials, SignupCredentials, EmailCheckResult, AuthError } from '@/types/auth.types';
import { UserGlobalRole } from '@/types/user.types';
import { findMockUserByEmail, mockEmailExists, mockUsers } from '../data/mock-users';
import { saveMockAuth, getMockAuth, clearMockAuth } from '../storage/auth-storage';
import { MOCK_API_DELAY } from '../config';

/**
 * Simulate API delay for realistic testing
 */
function simulateDelay(): Promise<void> {
  const delay = Math.random() * (MOCK_API_DELAY.MAX - MOCK_API_DELAY.MIN) + MOCK_API_DELAY.MIN;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Create an auth error
 */
function createAuthError(code: string, message: string): AuthError {
  return { code, message };
}

/**
 * Mock Authentication Service Implementation
 * 
 * This service simulates authentication without a real backend.
 * All data is stored in localStorage with the __MOCK__ prefix.
 */
class MockAuthService implements IAuthService {
  /**
   * Check if an email already exists in the system
   */
  async checkEmailExists(email: string): Promise<EmailCheckResult> {
    await simulateDelay();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createAuthError('invalid-email', 'Please enter a valid email address.');
    }

    const exists = mockEmailExists(email);
    
    return {
      exists,
      email: email.toLowerCase(),
    };
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    await simulateDelay();

    const { email, password } = credentials;

    // Find user
    const user = findMockUserByEmail(email);
    if (!user) {
      throw createAuthError('user-not-found', 'No account found with this email address.');
    }

    // Check password
    if (user.password !== password) {
      throw createAuthError('wrong-password', 'Incorrect password. Please try again.');
    }

    // Create auth user (without password)
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      globalRole: user.globalRole,
      createdAt: user.createdAt,
    };

    // Save to storage
    saveMockAuth(authUser);

    return authUser;
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignupCredentials): Promise<AuthUser> {
    await simulateDelay();

    const { email, password, displayName } = credentials;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createAuthError('invalid-email', 'Please enter a valid email address.');
    }

    // Check if email already exists
    if (mockEmailExists(email)) {
      throw createAuthError('email-already-exists', 'An account with this email already exists.');
    }

    // Validate password
    if (password.length < 6) {
      throw createAuthError('weak-password', 'Password must be at least 6 characters long.');
    }

    // Create new user with Customer role by default
    const newUser: AuthUser = {
      id: `mock-user-${Date.now()}`,
      email: email.toLowerCase(),
      displayName: displayName || email.split('@')[0],
      globalRole: UserGlobalRole.Customer,
      createdAt: new Date().toISOString(),
    };

    // In a real scenario, this would be saved to a database
    // For mock, we add it to the mock users array (in memory only)
    mockUsers.push({
      ...newUser,
      password,
    });

    // Save to storage
    saveMockAuth(newUser);

    return newUser;
  }

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    await simulateDelay();
    return getMockAuth();
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    await simulateDelay();

    const currentUser = getMockAuth();
    if (!currentUser) {
      throw createAuthError('unauthenticated', 'No user is currently signed in.');
    }

    if (currentUser.id !== userId) {
      throw createAuthError('unauthorized', 'You can only update your own profile.');
    }

    // Update user
    const updatedUser: AuthUser = {
      ...currentUser,
      ...data,
      id: currentUser.id, // Never allow ID changes
      email: currentUser.email, // Never allow email changes in this mock
    };

    // Save to storage
    saveMockAuth(updatedUser);

    return updatedUser;
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    await simulateDelay();
    clearMockAuth();
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();

