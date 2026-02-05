import type { AuthUser } from '@/types/auth.types';
import { UserGlobalRole } from '@/types/user.types';

/**
 * Mock user credentials for testing
 * All passwords are: 123456
 */
export interface MockUserWithPassword extends AuthUser {
  password: string;
}

export const mockUsers: MockUserWithPassword[] = [
  {
    id: 'mock-user-1',
    email: 'user@test.com',
    emailVerified: true,
    password: '123456',
    name: 'Regular User',
    globalRole: UserGlobalRole.USER,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'mock-user-2',
    email: 'superadmin@test.com',
    emailVerified: true,
    password: '123456',
    name: 'Super Admin',
    globalRole: UserGlobalRole.SUPER_ADMIN,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

/**
 * Find a mock user by email
 */
export function findMockUserByEmail(email: string): MockUserWithPassword | undefined {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Check if email exists in mock users
 */
export function mockEmailExists(email: string): boolean {
  return mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

