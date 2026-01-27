/**
 * User role type for super admin user management
 */
export type UserRole = 'Staff' | 'User';

/**
 * User status type
 */
export type UserStatus = 'Active' | 'Inactive';

/**
 * User interface for super admin management
 */
export interface SuperAdminUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastLogin: Date | null;
  avatarColor: string;
  avatarText: string;
}

/**
 * Mock users data for super admin management
 * 
 * Contains sample user data for testing and development.
 */
export const mockSuperAdminUsers: SuperAdminUser[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    role: 'Staff',
    status: 'Active',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatarColor: 'bg-blue-100',
    avatarText: 'JD',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    role: 'Staff',
    status: 'Active',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    avatarColor: 'bg-purple-100',
    avatarText: 'JS',
  },
  {
    id: '3',
    email: 'bob.wilson@example.com',
    displayName: 'Bob Wilson',
    role: 'User',
    status: 'Active',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 3 * 60 * 1000), // 3 mins ago
    avatarColor: 'bg-green-100',
    avatarText: 'BW',
  },
  {
    id: '4',
    email: 'alice.brown@example.com',
    displayName: 'Alice Brown',
    role: 'Staff',
    status: 'Inactive',
    createdAt: new Date('2023-12-10'),
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    avatarColor: 'bg-pink-100',
    avatarText: 'AB',
  },
  {
    id: '5',
    email: 'charlie.davis@example.com',
    displayName: 'Charlie Davis',
    role: 'User',
    status: 'Active',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    avatarColor: 'bg-yellow-100',
    avatarText: 'CD',
  },
  {
    id: '6',
    email: 'diana.miller@example.com',
    displayName: 'Diana Miller',
    role: 'User',
    status: 'Inactive',
    createdAt: new Date('2023-11-20'),
    lastLogin: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    avatarColor: 'bg-indigo-100',
    avatarText: 'DM',
  },
  {
    id: '7',
    email: 'alex.morgan@example.com',
    displayName: 'Alex Morgan',
    role: 'Staff',
    status: 'Active',
    createdAt: new Date('2023-10-01'),
    lastLogin: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    avatarColor: 'bg-orange-100',
    avatarText: 'AM',
  },
  // Add more mock data
  ...Array.from({ length: 43 }, (_, i) => ({
    id: String(i + 8),
    email: `user${i + 8}@example.com`,
    displayName: `User ${i + 8}`,
    role: ['Staff', 'User'][i % 2] as UserRole,
    status: ['Active', 'Inactive'][i % 2] as UserStatus,
    createdAt: new Date(2024, 0, 1 + (i % 60)),
    lastLogin: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000),
    avatarColor: ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'][i % 5],
    avatarText: `U${i + 8}`.substring(0, 2).toUpperCase(),
  })),
];

// For testing empty state, export an empty array option
export const mockSuperAdminUsersEmpty: SuperAdminUser[] = [];

