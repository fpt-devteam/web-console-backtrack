import type { IAuthService } from './auth.service.interface';
import type { AuthUser, LoginCredentials, SignupCredentials, EmailCheckResult } from '@/types/auth.types';

/**
 * Real Authentication Service Implementation
 * 
 * TODO: Implement real authentication logic here when ready.
 * 
 * This should integrate with your actual backend API:
 * - Firebase Authentication
 * - Custom API endpoints
 * - OAuth providers
 * etc.
 */
class RealAuthService implements IAuthService {
  async checkEmailExists(_email: string): Promise<EmailCheckResult> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }

  async signIn(_credentials: LoginCredentials): Promise<AuthUser> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }

  async signUp(_credentials: SignupCredentials): Promise<AuthUser> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }

  async updateUser(_userId: string, _data: Partial<AuthUser>): Promise<AuthUser> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }

  async signOut(): Promise<void> {
    throw new Error('Real auth service not implemented yet. Set USE_MOCK = true in src/mock/config.ts');
  }
}

export const realAuthService = new RealAuthService();

