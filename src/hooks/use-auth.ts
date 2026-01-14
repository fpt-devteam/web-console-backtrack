import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import type { LoginCredentials, SignupCredentials, AuthUser, AuthError } from '@/types/auth.types';

/**
 * Query keys for auth-related queries
 */
const AUTH_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
};

/**
 * Check if an email exists in the system
 * 
 * @example
 * const checkEmail = useCheckEmail();
 * checkEmail.mutate('test@example.com', {
 *   onSuccess: (result) => {
 *     if (result.exists) {
 *       navigate('/auth/signin');
 *     } else {
 *       navigate('/auth/create-password');
 *     }
 *   }
 * });
 */
export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmailExists(email),
  });
}

/**
 * Sign in with email and password
 * 
 * @example
 * const signIn = useSignIn();
 * signIn.mutate({ email, password }, {
 *   onSuccess: (user) => {
 *     navigate('/console/welcome');
 *   },
 *   onError: (error) => {
 *     showToast.error(error.message);
 *   }
 * });
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, AuthError, LoginCredentials>({
    mutationFn: (credentials) => authService.signIn(credentials),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
    },
  });
}

/**
 * Sign up with email and password
 * 
 * @example
 * const signUp = useSignUp();
 * signUp.mutate({ email, password, displayName }, {
 *   onSuccess: (user) => {
 *     navigate('/auth/check-email');
 *   }
 * });
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, AuthError, SignupCredentials>({
    mutationFn: (credentials) => authService.signUp(credentials),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
    },
  });
}

/**
 * Get the currently authenticated user
 * 
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 * if (isLoading) return <Spinner />;
 * if (!user) return <Navigate to="/auth/signin" />;
 * return <div>Welcome, {user.displayName}</div>;
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

/**
 * Update user profile
 * 
 * @example
 * const updateUser = useUpdateUser();
 * updateUser.mutate({ userId: user.id, data: { displayName: 'New Name' } });
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, AuthError, { userId: string; data: Partial<AuthUser> }>({
    mutationFn: ({ userId, data }) => authService.updateUser(userId, data),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
    },
  });
}

/**
 * Sign out the current user
 * 
 * @example
 * const signOut = useSignOut();
 * signOut.mutate();
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear the current user cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
    },
  });
}

