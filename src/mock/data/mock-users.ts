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
    email: 'customer@test.com',
    password: '123456',
    displayName: 'Customer User',
    globalRole: UserGlobalRole.Customer,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'mock-user-2',
    email: 'admin@test.com',
    password: '123456',
    displayName: 'Admin User',
    globalRole: UserGlobalRole.EnterpriseAdmin,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'mock-user-3',
    email: 'superadmin@test.com',
    password: '123456',
    displayName: 'Super Admin',
    globalRole: UserGlobalRole.PlatformSuperAdmin,
    createdAt: new Date('2024-01-01').toISOString(),
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

