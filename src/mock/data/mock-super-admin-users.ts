/**
 * User role type for super admin user management
 */
export type UserRole = 'Staff' | 'User';

/**
 * User status type
 */
export type UserStatus = 'Active' | 'Inactive';
export type QrPlanStatus = 'Active' | 'Payment Due' | 'Suspended' | 'Expired';

export interface QrPlan {
  tier: string;
  status: QrPlanStatus;
  renewalDate: Date;
  billingCycle: 'Monthly' | 'Yearly';
  price: {
    amount: number;
    currency: 'USD';
    period: 'month' | 'year';
  };
  description: string;
  includedFeatures: string[];
  quotas: {
    monthlyQrLimit: number;
    dynamicQrLimit: number;
    customDomains: number;
  };
}

export interface QrUsageOverview {
  systemStatus: 'Operational' | 'Degraded' | 'Down' | 'Maintenance';
  generatedQrs: {
    current: number;
    limit: number;
  };
  dynamicQrs: {
    current: number;
    limit: number;
  };
  storageUsedMb: {
    current: number;
    limit: number;
  };
}

export interface UserQrActivity {
  id: string;
  action: string;
  qrType: 'Static' | 'Dynamic';
  occurredAt: Date;
  status: 'Success' | 'Failed';
}

export interface UserBillingInvoice {
  id: string;
  invoiceDate: Date;
  amount: number;
  currency: 'USD';
  status: 'Paid' | 'Pending' | 'Overdue';
}

/**
 * User interface for super admin management
 */
export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  organizationName?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
  lastLogin: Date | null;
  avatarColor: string;
  avatarText: string;
  qrPlan?: QrPlan;
  qrUsageOverview?: QrUsageOverview;
  qrActivities?: UserQrActivity[];
  billingHistory?: UserBillingInvoice[];
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
    name: 'John Doe',
    role: 'Staff',
    status: 'Active',
    organizationName: 'Acme Corp',
    phone: '+1 (555) 123-4567',
    department: 'Operations',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatarColor: 'bg-blue-100',
    avatarText: 'JD',
    qrPlan: {
      tier: 'QR Pro',
      status: 'Active',
      renewalDate: new Date('2026-12-31'),
      billingCycle: 'Yearly',
      price: { amount: 39.99, currency: 'USD', period: 'year' },
      description: 'Designed for operational teams managing both static and dynamic QR campaigns.',
      includedFeatures: ['Dynamic QR', 'Scan Analytics', 'Bulk QR Export', 'Priority Support'],
      quotas: {
        monthlyQrLimit: 5000,
        dynamicQrLimit: 500,
        customDomains: 2,
      },
    },
    qrUsageOverview: {
      systemStatus: 'Operational',
      generatedQrs: { current: 2860, limit: 5000 },
      dynamicQrs: { current: 310, limit: 500 },
      storageUsedMb: { current: 920, limit: 2048 },
    },
    qrActivities: [
      { id: 'ACT-001', action: 'Created batch QR campaign', qrType: 'Static', occurredAt: new Date('2026-03-18'), status: 'Success' },
      { id: 'ACT-002', action: 'Updated destination URL', qrType: 'Dynamic', occurredAt: new Date('2026-03-17'), status: 'Success' },
      { id: 'ACT-003', action: 'Exported print-ready assets', qrType: 'Static', occurredAt: new Date('2026-03-15'), status: 'Success' },
      { id: 'ACT-004', action: 'Regenerated QR after branding update', qrType: 'Dynamic', occurredAt: new Date('2026-03-11'), status: 'Success' },
    ],
    billingHistory: [
      { id: 'INV-2401', invoiceDate: new Date('2026-01-02'), amount: 39.99, currency: 'USD', status: 'Paid' },
      { id: 'INV-2402', invoiceDate: new Date('2026-02-02'), amount: 39.99, currency: 'USD', status: 'Paid' },
      { id: 'INV-2403', invoiceDate: new Date('2026-03-02'), amount: 39.99, currency: 'USD', status: 'Pending' },
    ],
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'Staff',
    status: 'Active',
    organizationName: 'Nova Retail',
    phone: '+1 (555) 222-3344',
    department: 'Marketing',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    avatarColor: 'bg-purple-100',
    avatarText: 'JS',
    qrPlan: {
      tier: 'QR Growth',
      status: 'Payment Due',
      renewalDate: new Date('2026-04-10'),
      billingCycle: 'Monthly',
      price: { amount: 9.99, currency: 'USD', period: 'month' },
      description: 'Great for small teams that need flexible QR campaigns with moderate volume.',
      includedFeatures: ['Static QR', 'Dynamic QR', 'Basic Analytics'],
      quotas: {
        monthlyQrLimit: 1200,
        dynamicQrLimit: 120,
        customDomains: 0,
      },
    },
    qrUsageOverview: {
      systemStatus: 'Degraded',
      generatedQrs: { current: 980, limit: 1200 },
      dynamicQrs: { current: 114, limit: 120 },
      storageUsedMb: { current: 420, limit: 512 },
    },
    qrActivities: [
      { id: 'ACT-101', action: 'Created spring campaign QR set', qrType: 'Static', occurredAt: new Date('2026-03-16'), status: 'Success' },
      { id: 'ACT-102', action: 'Edited landing URL parameter', qrType: 'Dynamic', occurredAt: new Date('2026-03-13'), status: 'Success' },
      { id: 'ACT-103', action: 'Bulk import from CSV', qrType: 'Static', occurredAt: new Date('2026-03-09'), status: 'Failed' },
    ],
    billingHistory: [
      { id: 'INV-3101', invoiceDate: new Date('2026-01-10'), amount: 9.99, currency: 'USD', status: 'Paid' },
      { id: 'INV-3102', invoiceDate: new Date('2026-02-10'), amount: 9.99, currency: 'USD', status: 'Paid' },
      { id: 'INV-3103', invoiceDate: new Date('2026-03-10'), amount: 9.99, currency: 'USD', status: 'Overdue' },
    ],
  },
  {
    id: '3',
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
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
    name: 'Alice Brown',
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
    name: 'Charlie Davis',
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
    name: 'Diana Miller',
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
    name: 'Alex Morgan',
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
      name: `User ${i + 8}`,
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

