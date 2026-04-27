interface ApiSuccess<T> { success: true; data: T }

export type RevenueStatus = 'Succeeded' | 'Failed' | 'Pending';

export type SubscriberType = 'Organization' | 'User';

export interface RevenueTransaction {
  id: string;
  subscriberType: SubscriberType;
  tenantId?: string;
  tenantName?: string;
  userId?: string;
  userName?: string;
  amount: number;
  currency: string;
  status: RevenueStatus;
  paymentMethod: string;
  transactionDate: Date;
  description: string;
  invoiceNumber?: string;
  subscriptionPlan?: string;
  qrCodeId?: string;
  qrCodeName?: string;
}

/**
 * Revenue summary interface
 */
export interface RevenueSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  growthPercentage: number;
  totalTransactions: number;
  averageTransactionValue: number;
  subscriptionRevenue: number;
  qrSalesRevenue: number;
  subscriptionTransactions: number;
  qrSalesTransactions: number;
}

/**
 * Mock revenue transactions data
 * 
 * Contains sample revenue transaction data for testing and development.
 * Includes both subscription revenue (from tenants) and QR sales revenue (from end users).
 */
export const mockRevenueTransactions: Array<RevenueTransaction> = [
  {
    id: '1',
    subscriberType: 'Organization',
    tenantId: '1',
    tenantName: 'Acme Corp',
    amount: 4999.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-15'),
    description: 'Enterprise Gold - Monthly Subscription',
    invoiceNumber: 'INV-2024-001',
    subscriptionPlan: 'Enterprise Gold',
  },
  {
    id: '2',
    subscriberType: 'Organization',
    tenantId: '2',
    tenantName: 'Stark Industries',
    amount: 2999.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-14'),
    description: 'Enterprise Silver - Monthly Subscription',
    invoiceNumber: 'INV-2024-002',
    subscriptionPlan: 'Enterprise Silver',
  },
  {
    id: '3',
    subscriberType: 'Organization',
    tenantId: '3',
    tenantName: 'Wayne Enterprises',
    amount: 1999.99,
    currency: 'usd',
    status: 'Pending',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-13'),
    description: 'Professional - Monthly Subscription',
    invoiceNumber: 'INV-2024-003',
    subscriptionPlan: 'Professional',
  },
  {
    id: '4',
    subscriberType: 'Organization',
    tenantId: '4',
    tenantName: 'Cyberdyne',
    amount: 4999.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-12'),
    description: 'Enterprise Gold - Monthly Subscription',
    invoiceNumber: 'INV-2024-004',
    subscriptionPlan: 'Enterprise Gold',
  },
  {
    id: '5',
    subscriberType: 'User',
    userId: 'user-1',
    userName: 'John Doe',
    amount: 1.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-15'),
    description: 'QR Code Purchase',
    invoiceNumber: 'INV-2024-005',
  },
  {
    id: '6',
    subscriberType: 'User',
    userId: 'user-2',
    userName: 'Jane Smith',
    amount: 1.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-14'),
    description: 'QR Code Purchase',
    invoiceNumber: 'INV-2024-006',
  },
  {
    id: '7',
    subscriberType: 'User',
    userId: 'user-3',
    userName: 'Bob Johnson',
    amount: 1.99,
    currency: 'usd',
    status: 'Succeeded',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-13'),
    description: 'QR Code Purchase',
    invoiceNumber: 'INV-2024-007',
  },
  {
    id: '8',
    subscriberType: 'User',
    userId: 'user-4',
    userName: 'Alice Williams',
    amount: 1.99,
    currency: 'usd',
    status: 'Pending',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-12'),
    description: 'QR Code Purchase',
    invoiceNumber: 'INV-2024-008',
  },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `sub-${i + 9}`,
    subscriberType: 'Organization' as SubscriberType,
    tenantId: String(i + 9),
    tenantName: `Company ${i + 9}`,
    amount: [9.99, 19.99, 29.99, 49.99, 99.99][i % 5],
    currency: 'usd',
    status: ['Succeeded', 'Pending', 'Failed'][i % 3] as RevenueStatus,
    paymentMethod: 'Stripe',
    transactionDate: new Date(2024, 0, 15 - (i % 30)),
    description: `${['Basic', 'Professional', 'Enterprise Silver', 'Enterprise Gold'][i % 4]} - Monthly Subscription`,
    invoiceNumber: `INV-2024-${String(i + 9).padStart(3, '0')}`,
    subscriptionPlan: ['Basic', 'Professional', 'Enterprise Silver', 'Enterprise Gold'][i % 4],
  })),
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `qr-${i + 1}`,
    subscriberType: 'User' as SubscriberType,
    userId: `user-${i + 5}`,
    userName: `User ${i + 5}`,
    amount: 1.99,
    currency: 'usd',
    status: ['Succeeded', 'Pending', 'Failed'][i % 3] as RevenueStatus,
    paymentMethod: 'Stripe',
    transactionDate: new Date(2024, 0, 15 - (i % 30)),
    description: 'QR Code Purchase',
    invoiceNumber: `INV-2024-QR-${String(i + 1).padStart(3, '0')}`,
  })),
];

/**
 * Mock revenue summary data
 */
export const mockRevenueSummary: RevenueSummary = {
  totalRevenue: 1250000.00,
  monthlyRevenue: 125000.00,
  growthPercentage: 15.5,
  totalTransactions: 1250,
  averageTransactionValue: 2500.00,
  subscriptionRevenue: 1000000.00,
  qrSalesRevenue: 250000.00,
  subscriptionTransactions: 1000,
  qrSalesTransactions: 250,
};

export interface MonthlyRevenueItem {
  month: string
  subscription: number
  qrSales: number
  total: number
}

/**
 * Mock monthly revenue data for chart (combined)
 * GET /api/core/super-admin/revenue/monthly
 */
export const mockMonthlyRevenue: Array<MonthlyRevenueItem> = [
  { month: 'Jan', subscription: 80000, qrSales: 15000, total: 95000 },
  { month: 'Feb', subscription: 85000, qrSales: 20000, total: 105000 },
  { month: 'Mar', subscription: 90000, qrSales: 20000, total: 110000 },
  { month: 'Apr', subscription: 95000, qrSales: 20000, total: 115000 },
  { month: 'May', subscription: 100000, qrSales: 20000, total: 120000 },
  { month: 'Jun', subscription: 98000, qrSales: 20000, total: 118000 },
  { month: 'Jul', subscription: 102000, qrSales: 20000, total: 122000 },
  { month: 'Aug', subscription: 105000, qrSales: 20000, total: 125000 },
  { month: 'Sep', subscription: 108000, qrSales: 20000, total: 128000 },
  { month: 'Oct', subscription: 110000, qrSales: 20000, total: 130000 },
  { month: 'Nov', subscription: 105000, qrSales: 20000, total: 125000 },
  { month: 'Dec', subscription: 105000, qrSales: 20000, total: 125000 },
];

// ── ApiSuccess envelopes (mirrors real API shape) ──────────────────────────

/** GET /api/core/super-admin/revenue/summary */
export const mockRevenueSummaryApi: ApiSuccess<RevenueSummary> = {
  success: true,
  data: mockRevenueSummary,
}

/** GET /api/core/super-admin/revenue/monthly?months=12 */
export const mockMonthlyRevenueApi: ApiSuccess<Array<MonthlyRevenueItem>> = {
  success: true,
  data: mockMonthlyRevenue,
}

export interface RevenueTransactionsPage {
  items: Array<RevenueTransaction>
  total: number
}

/** GET /api/core/super-admin/revenue/transactions?page=1&pageSize=10 */
export const mockRevenueTransactionsApi: ApiSuccess<RevenueTransactionsPage> = {
  success: true,
  data: {
    items: mockRevenueTransactions.slice(0, 10),
    total: mockRevenueTransactions.length,
  },
}

