/**
 * Revenue transaction status type
 */
export type RevenueStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';

/**
 * Payment method type
 */
export type PaymentMethod = 'Credit Card' | 'Bank Transfer' | 'PayPal' | 'Stripe' | 'Wire Transfer';

/**
 * Revenue type - distinguishes between subscription and QR sales
 */
export type RevenueType = 'Subscription' | 'QR Sales';

/**
 * Revenue transaction interface
 */
export interface RevenueTransaction {
  id: string;
  revenueType: RevenueType;
  tenantId?: string;
  tenantName?: string;
  userId?: string;
  userName?: string;
  amount: number;
  currency: string;
  status: RevenueStatus;
  paymentMethod: PaymentMethod;
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
export const mockRevenueTransactions: RevenueTransaction[] = [
  // Subscription Revenue (from tenants)
  {
    id: '1',
    revenueType: 'Subscription',
    tenantId: '1',
    tenantName: 'Acme Corp',
    amount: 4999.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionDate: new Date('2024-01-15'),
    description: 'Enterprise Gold - Monthly Subscription',
    invoiceNumber: 'INV-2024-001',
    subscriptionPlan: 'Enterprise Gold',
  },
  {
    id: '2',
    revenueType: 'Subscription',
    tenantId: '2',
    tenantName: 'Stark Industries',
    amount: 2999.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-14'),
    description: 'Enterprise Silver - Monthly Subscription',
    invoiceNumber: 'INV-2024-002',
    subscriptionPlan: 'Enterprise Silver',
  },
  {
    id: '3',
    revenueType: 'Subscription',
    tenantId: '3',
    tenantName: 'Wayne Enterprises',
    amount: 1999.99,
    currency: 'USD',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    transactionDate: new Date('2024-01-13'),
    description: 'Professional - Monthly Subscription',
    invoiceNumber: 'INV-2024-003',
    subscriptionPlan: 'Professional',
  },
  {
    id: '4',
    revenueType: 'Subscription',
    tenantId: '4',
    tenantName: 'Cyberdyne',
    amount: 4999.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionDate: new Date('2024-01-12'),
    description: 'Enterprise Gold - Monthly Subscription',
    invoiceNumber: 'INV-2024-004',
    subscriptionPlan: 'Enterprise Gold',
  },
  // QR Sales Revenue (from end users)
  {
    id: '5',
    revenueType: 'QR Sales',
    userId: 'user-1',
    userName: 'John Doe',
    amount: 29.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionDate: new Date('2024-01-15'),
    description: 'QR Code Purchase - Premium QR',
    qrCodeId: 'qr-001',
    qrCodeName: 'Premium QR Code',
  },
  {
    id: '6',
    revenueType: 'QR Sales',
    userId: 'user-2',
    userName: 'Jane Smith',
    amount: 19.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'PayPal',
    transactionDate: new Date('2024-01-14'),
    description: 'QR Code Purchase - Standard QR',
    qrCodeId: 'qr-002',
    qrCodeName: 'Standard QR Code',
  },
  {
    id: '7',
    revenueType: 'QR Sales',
    userId: 'user-3',
    userName: 'Bob Johnson',
    amount: 49.99,
    currency: 'USD',
    status: 'Completed',
    paymentMethod: 'Stripe',
    transactionDate: new Date('2024-01-13'),
    description: 'QR Code Purchase - Enterprise QR',
    qrCodeId: 'qr-003',
    qrCodeName: 'Enterprise QR Code',
  },
  {
    id: '8',
    revenueType: 'QR Sales',
    userId: 'user-4',
    userName: 'Alice Williams',
    amount: 29.99,
    currency: 'USD',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    transactionDate: new Date('2024-01-12'),
    description: 'QR Code Purchase - Premium QR',
    qrCodeId: 'qr-004',
    qrCodeName: 'Premium QR Code',
  },
  // Add more subscription revenue transactions
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `sub-${i + 9}`,
    revenueType: 'Subscription' as RevenueType,
    tenantId: String(i + 9),
    tenantName: `Company ${i + 9}`,
    amount: [999.99, 1499.99, 1999.99, 2999.99, 4999.99][i % 5],
    currency: 'USD',
    status: ['Completed', 'Pending', 'Failed', 'Refunded'][i % 4] as RevenueStatus,
    paymentMethod: ['Credit Card', 'Bank Transfer', 'PayPal', 'Stripe', 'Wire Transfer'][i % 5] as PaymentMethod,
    transactionDate: new Date(2024, 0, 15 - (i % 30)),
    description: `${['Basic', 'Professional', 'Enterprise Silver', 'Enterprise Gold'][i % 4]} - Monthly Subscription`,
    invoiceNumber: `INV-2024-${String(i + 9).padStart(3, '0')}`,
    subscriptionPlan: ['Basic', 'Professional', 'Enterprise Silver', 'Enterprise Gold'][i % 4],
  })),
  // Add more QR sales revenue transactions
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `qr-${i + 1}`,
    revenueType: 'QR Sales' as RevenueType,
    userId: `user-${i + 5}`,
    userName: `User ${i + 5}`,
    amount: [9.99, 19.99, 29.99, 49.99, 99.99][i % 5],
    currency: 'USD',
    status: ['Completed', 'Pending', 'Failed', 'Refunded'][i % 4] as RevenueStatus,
    paymentMethod: ['Credit Card', 'PayPal', 'Stripe'][i % 3] as PaymentMethod,
    transactionDate: new Date(2024, 0, 15 - (i % 30)),
    description: `QR Code Purchase - ${['Standard', 'Premium', 'Enterprise'][i % 3]} QR`,
    qrCodeId: `qr-code-${i + 1}`,
    qrCodeName: `${['Standard', 'Premium', 'Enterprise'][i % 3]} QR Code`,
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

/**
 * Mock monthly revenue data for chart (combined)
 */
export const mockMonthlyRevenue = [
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

