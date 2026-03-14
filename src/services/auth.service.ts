import type { IAuthService } from './auth.service.interface';
import type { AuthUser, LoginCredentials, SignupCredentials, EmailCheckResult, AuthError } from '@/types/auth.types';
import { auth } from '@/lib/firebase';
import { publicClient } from '@/lib/api-client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  type User as FirebaseUser,
} from 'firebase/auth';
import { UserGlobalRole } from '@/types/user.types';
import { userService } from './user.service';

function createAuthError(error: any): AuthError {
  const code = error?.code || 'unknown';
  let message = 'An error occurred. Please try again.';

  switch (code) {
    case 'auth/email-already-in-use':
      message = 'An account with this email already exists.';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.';
      break;
    case 'auth/weak-password':
      message = 'Password should be at least 6 characters.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email address.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later.';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Sign in was cancelled.';
      break;
    default:
      message = error?.message || message;
  }

  return { code, message };
}

function firebaseUserToAuthUser(firebaseUser: FirebaseUser): AuthUser {
  const now = new Date().toISOString();
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    emailVerified: firebaseUser.emailVerified,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    globalRole: UserGlobalRole.USER,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
}

/** BE API /auth/check-email response shape */
interface CheckEmailApiResponse {
  success: boolean;
  data?: {
    status: 'Verified' | 'NotVerified' | 'NotFound';
    email: string;
  };
  error?: { code: string; message: string };
}

class RealAuthService implements IAuthService {
  async checkEmailExists(email: string): Promise<EmailCheckResult> {
    const trimmedEmail = email.trim().toLowerCase();
    try {
      const { data } = await publicClient.post<CheckEmailApiResponse>('/auth/check-email', {
        email: trimmedEmail,
      });

      if (!data.success || !data.data) {
        return { exists: false, email: trimmedEmail };
      }

      const status = data.data.status;
      const exists = status === 'Verified' || status === 'NotVerified';
      return {
        exists,
        email: data.data.email ?? trimmedEmail,
      };
    } catch (error: any) {
      const message = error?.response?.data?.error?.message ?? error?.message ?? 'Unable to check email. Please try again.';
      throw { code: error?.response?.data?.error?.code ?? 'unknown', message };
    }
  }

  async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return firebaseUserToAuthUser(userCredential.user);
    } catch (error: any) {
      throw createAuthError(error);
    }
  }

  async signUp(credentials: SignupCredentials): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      return firebaseUserToAuthUser(userCredential.user);
    } catch (error: any) {
      throw createAuthError(error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw createAuthError({ code: 'auth/user-not-found', message: 'No user is currently signed in.' });
      }
      await sendEmailVerification(currentUser);
    } catch (error: any) {
      throw createAuthError(error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          unsubscribe();
          if (!firebaseUser) {
            resolve(null);
            return;
          }

          const baseUser = firebaseUserToAuthUser(firebaseUser);

          try {
            const profile = await userService.getMe();
            resolve({ ...baseUser, globalRole: profile.globalRole });
          } catch {
            // Fallback: if BE is unreachable or token invalid, keep USER.
            resolve(baseUser);
          }
        },
        (error) => {
          unsubscribe();
          reject(createAuthError(error));
        }
      );
    });
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw createAuthError(error);
    }
  }
}

export const realAuthService = new RealAuthService();

