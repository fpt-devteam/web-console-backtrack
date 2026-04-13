export interface PlanDetails {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  renewsOn: string;
  usage: {
    posts: { current: number; limit: number | null };
    employees: { current: number; limit: number };
  };
}

export interface AvailablePlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    employees: string;
    posts: string;
    analytics?: boolean;
    support?: string;
  };
}

export interface AccountDetails {
  organization: string;
  adminEmail: string;
  taxId: string;
}

export interface BillingAddress {
  street: string;
  suite: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiresMonth: number;
  expiresYear: number;
}

export const mockCurrentPlan: PlanDetails = {
  name: 'Standard',
  price: 49,
  billingCycle: 'monthly',
  status: 'active',
  renewsOn: 'Feb 14, 2024',
  usage: {
    posts: { current: 842, limit: null }, // null = unlimited
    employees: { current: 12, limit: 20 },
  },
};

export const mockAvailablePlans: AvailablePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: {
      employees: '5 Employees',
      posts: '50 Posts/mo',
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'For growing businesses with custom options.',
    monthlyPrice: 49,
    yearlyPrice: 470, // ~20% discount
    features: {
      employees: '20 Employees',
      posts: 'Unlimited Posts',
      analytics: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Scale without limits for large organizations.',
    monthlyPrice: 199,
    yearlyPrice: 1910, // ~20% discount
    features: {
      employees: 'Unlimited Employees',
      posts: 'Unlimited Posts',
      support: 'Priority Support',
    },
  },
];

export const mockAccountDetails: AccountDetails = {
  organization: 'Acme Corp Holdings',
  adminEmail: 'billing@acmecorp.com',
  taxId: 'US-123456789',
};

export const mockBillingAddress: BillingAddress = {
  street: '123 Innovation Drive',
  suite: 'Suite 400',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94103',
  country: 'United States',
};

export const mockPaymentMethod: PaymentMethod = {
  type: 'visa',
  last4: '4242',
  expiresMonth: 12,
  expiresYear: 2025,
};

export interface OrgBillingHistoryRow {
  id: string;
  invoiceDate: string;
  description: string;
  amount: number;
  currency: 'USD';
  status: 'Paid' | 'Pending' | 'Failed';
}

export const mockOrgBillingHistory: OrgBillingHistoryRow[] = [
  {
    id: 'INV-2024-089',
    invoiceDate: 'Jan 14, 2024',
    description: 'Standard Plan — Monthly subscription',
    amount: 49,
    currency: 'USD',
    status: 'Paid',
  },
  {
    id: 'INV-2024-062',
    invoiceDate: 'Dec 14, 2023',
    description: 'Standard Plan — Monthly subscription',
    amount: 49,
    currency: 'USD',
    status: 'Paid',
  },
  {
    id: 'INV-2024-041',
    invoiceDate: 'Nov 14, 2023',
    description: 'Standard Plan — Monthly subscription',
    amount: 49,
    currency: 'USD',
    status: 'Paid',
  },
  {
    id: 'INV-2024-028',
    invoiceDate: 'Oct 14, 2023',
    description: 'Proration — plan change',
    amount: 12.5,
    currency: 'USD',
    status: 'Paid',
  },
];

