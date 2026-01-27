/**
 * Tenant status type
 */
export type TenantStatus = 'Active' | 'Pending' | 'Inactive';

/**
 * Subscription plan tier type
 */
export type SubscriptionTier = 'Enterprise Gold' | 'Enterprise Silver' | 'Professional' | 'Basic';

/**
 * Subscription plan status type
 */
export type SubscriptionStatus = 'Good Standing' | 'Payment Due' | 'Suspended' | 'Cancelled';

/**
 * System status type
 */
export type SystemStatus = 'Operational' | 'Degraded' | 'Down' | 'Maintenance';

/**
 * Enabled module type
 */
export interface EnabledModule {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

/**
 * Subscription plan interface
 */
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  renewalDate: Date;
  description: string;
}

/**
 * Usage overview interface
 */
export interface UsageOverview {
  activeUsers: {
    current: number;
    limit: number;
  };
  storageUsed: {
    current: number; // in GB
    limit: number; // in GB
  };
  systemStatus: SystemStatus;
}

/**
 * Tenant interface
 */
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: TenantStatus;
  createdDate: Date;
  adminEmail: string;
  lastActivity: Date;
  avatarColor: string;
  avatarText: string;
  taxId?: string;
  subscriptionPlan?: SubscriptionPlan;
  usageOverview?: UsageOverview;
  enabledModules?: EnabledModule[];
}

/**
 * Mock tenants data
 * 
 * Contains sample tenant data for testing and development.
 */
export const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corp',
    subdomain: 'acme.portal.com',
    status: 'Active',
    createdDate: new Date('2023-10-12'),
    adminEmail: 'admin@acme.com',
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
    avatarColor: 'bg-gray-200',
    avatarText: 'AME',
    taxId: 'US-84-39201',
    subscriptionPlan: {
      tier: 'Enterprise Gold',
      status: 'Good Standing',
      renewalDate: new Date('2024-12-31'),
      description: 'This plan includes advanced security features, priority support, and unlimited API access.',
    },
    usageOverview: {
      activeUsers: {
        current: 142,
        limit: 200,
      },
      storageUsed: {
        current: 45,
        limit: 1024, // 1TB
      },
      systemStatus: 'Operational',
    },
    enabledModules: [
      { id: '1', name: 'Public API', icon: '🔌', enabled: true },
      { id: '2', name: 'SSO Login', icon: '🔐', enabled: true },
      { id: '3', name: 'Adv. Analytics', icon: '📊', enabled: true },
      { id: '4', name: 'Priority Support', icon: '🎯', enabled: true },
    ],
  },
  {
    id: '2',
    name: 'Stark Industries',
    subdomain: 'stark.app.com',
    status: 'Pending',
    createdDate: new Date('2023-10-10'),
    adminEmail: 'tony@stark.com',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    avatarColor: 'bg-orange-100',
    avatarText: 'S',
  },
  {
    id: '3',
    name: 'Wayne Enterprises',
    subdomain: 'wayne.app.com',
    status: 'Inactive',
    createdDate: new Date('2023-09-01'),
    adminEmail: 'bruce@wayne.com',
    lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    avatarColor: 'bg-gray-200',
    avatarText: 'e',
  },
  {
    id: '4',
    name: 'Cyberdyne',
    subdomain: 'cyberdyne.app.com',
    status: 'Active',
    createdDate: new Date('2023-08-15'),
    adminEmail: 'miles@cyberdyne.net',
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    avatarColor: 'bg-purple-100',
    avatarText: 'C',
  },
  // Add more mock data to reach 48 total
  ...Array.from({ length: 44 }, (_, i) => ({
    id: String(i + 5),
    name: `Company ${i + 5}`,
    subdomain: `company${i + 5}.app.com`,
    status: ['Active', 'Pending', 'Inactive'][i % 3] as TenantStatus,
    createdDate: new Date(2023, 7 - (i % 8), 1 + (i % 28)),
    adminEmail: `admin${i + 5}@company.com`,
    lastActivity: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000),
    avatarColor: ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'][i % 5],
    avatarText: `C${i + 5}`.substring(0, 3).toUpperCase(),
  })),
];

// For testing empty state, export an empty array option
export const mockTenantsEmpty: Tenant[] = [];

