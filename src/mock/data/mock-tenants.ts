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
 * Billing cycle type
 */
export type BillingCycle = 'Monthly' | 'Yearly';

/**
 * Invoice payment status type
 */
export type InvoicePaymentStatus = 'Paid' | 'Failed' | 'Refunded' | 'Pending';

export type TenantMemberRole = 'OrgAdmin' | 'OrgStaff';
export type TenantMemberStatus = 'Active' | 'Inactive';

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
 * Feature usage metric for tenant subscription features.
 * `limit: null` => unlimited.
 */
export interface FeatureUsageMetric {
  feature: string;
  current: number;
  limit: number | null;
  unit?: string;
}

/**
 * Subscription plan interface
 */
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  renewalDate: Date;
  description: string;
  billingCycle?: BillingCycle;
  price?: {
    amount: number;
    currency: 'USD';
    period: 'month' | 'year';
  };
  includedFeatures?: string[];
  featureUsage?: FeatureUsageMetric[];
  quotasSummary?: {
    activeUsersLimit: number;
    storageLimitGB: number;
  };
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
  /** Workspace URL slug (BE: org.slug) */
  slug?: string;
  /** BE: org.industryType (raw key, e.g. "technology") */
  industryType?: string;
  /** BE: org.phone */
  phone?: string;
  /** BE: org.displayAddress */
  displayAddress?: string;
  /** BE: org.taxIdentificationNumber */
  taxIdentificationNumber?: string;
  status: TenantStatus;
  createdDate: Date;
  adminEmail: string;
  lastActivity: Date;
  avatarColor: string;
  avatarText: string;
  /**
   * Backward compat (older UI used taxId). Prefer taxIdentificationNumber.
   */
  taxId?: string;
  /** Org logo URL (e.g. public URL or data URL) */
  logoUrl?: string;
  subscriptionPlan?: SubscriptionPlan;
  usageOverview?: UsageOverview;
  enabledModules?: EnabledModule[];

  // Mock sections for tenant detail page (no BE yet)
  billingHistory?: Array<{
    id: string;
    invoiceDate: Date;
    amount: number;
    currency: 'USD';
    status: InvoicePaymentStatus;
  }>;
  members?: Array<{
    id: string;
    name: string;
    email: string;
    role: TenantMemberRole;
    status: TenantMemberStatus;
    lastActiveAt: Date;
  }>;
  activityLog?: Array<{
    id: string;
    timestamp: Date;
    actor: string;
    action: string;
    details?: string;
  }>;
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
    slug: 'acme-corp',
    industryType: 'technology',
    phone: '+1 (555) 000-0001',
    displayAddress: '123 Main St, Springfield, USA',
    status: 'Active',
    createdDate: new Date('2023-10-12'),
    adminEmail: 'admin@acme.com',
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
    avatarColor: 'bg-gray-200',
    avatarText: 'AME',
    logoUrl: 'https://picsum.photos/seed/acme-org-logo/128/128',
    taxIdentificationNumber: 'US-84-39201',
    taxId: 'US-84-39201',
    subscriptionPlan: {
      tier: 'Enterprise Gold',
      status: 'Good Standing',
      renewalDate: new Date('2024-12-31'),
      billingCycle: 'Yearly',
      price: { amount: 49.99, currency: 'USD', period: 'year' },
      description: 'This plan includes advanced security features, priority support, and unlimited API access.',
      includedFeatures: [
        'Print unlimited QR codes',
        'Setup your Backtrack profile',
        'Custom QR design & branding',
        'Priority support',
      ],
      featureUsage: [
        { feature: 'Print unlimited QR codes', current: 1200, limit: null, unit: 'QRs' },
        { feature: 'Setup your Backtrack profile', current: 1, limit: 1, unit: '' },
        { feature: 'Custom QR design & branding', current: 12, limit: 20, unit: 'designs' },
        { feature: 'Priority support', current: 5, limit: 10, unit: 'tickets' },
      ],
      quotasSummary: { activeUsersLimit: 200, storageLimitGB: 1024 },
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

    billingHistory: [
      { id: 'inv_1007', invoiceDate: new Date('2024-12-31'), amount: 49.99, currency: 'USD', status: 'Paid' },
      { id: 'inv_0998', invoiceDate: new Date('2024-11-30'), amount: 49.99, currency: 'USD', status: 'Paid' },
      { id: 'inv_0989', invoiceDate: new Date('2024-10-31'), amount: 49.99, currency: 'USD', status: 'Paid' },
      { id: 'inv_0975', invoiceDate: new Date('2024-09-30'), amount: 49.99, currency: 'USD', status: 'Paid' },
    ],
    members: [
      {
        id: 'u1',
        name: 'Admin Acme',
        email: 'admin@acme.com',
        role: 'OrgAdmin',
        status: 'Active',
        lastActiveAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: 'u2',
        name: 'Staff One',
        email: 'staff1@acme.com',
        role: 'OrgStaff',
        status: 'Active',
        lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'u3',
        name: 'Staff Two',
        email: 'staff2@acme.com',
        role: 'OrgStaff',
        status: 'Inactive',
        lastActiveAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'u4',
        name: 'Staff Three',
        email: 'staff3@acme.com',
        role: 'OrgStaff',
        status: 'Active',
        lastActiveAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
    activityLog: [
      {
        id: 'e1',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        actor: 'admin@acme.com',
        action: 'Subscription Updated',
        details: 'Renewed yearly plan (Enterprise Gold).',
      },
      {
        id: 'e2',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        actor: 'staff1@acme.com',
        action: 'Module Enabled',
        details: 'Enabled Adv. Analytics.',
      },
      {
        id: 'e3',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        actor: 'system',
        action: 'System Status Check',
        details: 'Operational',
      },
      {
        id: 'e4',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actor: 'admin@acme.com',
        action: 'Member Status Updated',
        details: 'Updated staff2@acme.com to Inactive.',
      },
    ],
  },
  {
    id: '2',
    name: 'Stark Industries',
    subdomain: 'stark.app.com',
    slug: 'stark-industries',
    industryType: 'manufacturing',
    phone: '+1 (555) 000-0002',
    displayAddress: '88 Park Ave, New York, USA',
    status: 'Pending',
    createdDate: new Date('2023-10-10'),
    adminEmail: 'tony@stark.com',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    avatarColor: 'bg-orange-100',
    avatarText: 'S',
    taxIdentificationNumber: 'US-11-223344',
    taxId: 'US-11-223344',
  },
  {
    id: '3',
    name: 'Wayne Enterprises',
    subdomain: 'wayne.app.com',
    slug: 'wayne-enterprises',
    industryType: 'finance',
    phone: '+1 (555) 000-0003',
    displayAddress: '1000 Gotham Blvd, Gotham, USA',
    status: 'Inactive',
    createdDate: new Date('2023-09-01'),
    adminEmail: 'bruce@wayne.com',
    lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    avatarColor: 'bg-gray-200',
    avatarText: 'e',
    taxIdentificationNumber: 'US-55-778899',
    taxId: 'US-55-778899',
  },
  {
    id: '4',
    name: 'Cyberdyne',
    subdomain: 'cyberdyne.app.com',
    slug: 'cyberdyne',
    industryType: 'healthcare',
    phone: '+1 (555) 000-0004',
    displayAddress: '42 Industrial Rd, Boston, USA',
    status: 'Active',
    createdDate: new Date('2023-08-15'),
    adminEmail: 'miles@cyberdyne.net',
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    avatarColor: 'bg-purple-100',
    avatarText: 'C',
    taxIdentificationNumber: 'US-90-112233',
    taxId: 'US-90-112233',
  },
  // Add more mock data to reach 48 total
  ...Array.from({ length: 44 }, (_, i) => ({
    id: String(i + 5),
    name: `Company ${i + 5}`,
    subdomain: `company${i + 5}.app.com`,
    slug: `company-${i + 5}`,
    industryType: (['technology', 'healthcare', 'finance', 'retail', 'education'] as const)[i % 5],
    phone: `+1 (555) 000-${String(1000 + i).slice(-4)}`,
    displayAddress: `Company address ${i + 5}, City, Country`,
    status: ['Active', 'Pending', 'Inactive'][i % 3] as TenantStatus,
    createdDate: new Date(2023, 7 - (i % 8), 1 + (i % 28)),
    adminEmail: `admin${i + 5}@company.com`,
    lastActivity: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000),
    avatarColor: ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'][i % 5],
    avatarText: `C${i + 5}`.substring(0, 3).toUpperCase(),
    taxIdentificationNumber: `TAX-${i + 5}`,
    taxId: `TAX-${i + 5}`,
  })),
];

// For testing empty state, export an empty array option
export const mockTenantsEmpty: Tenant[] = [];

