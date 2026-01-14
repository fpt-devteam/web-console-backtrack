export interface PlanDetails {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  renewsOn: string;
  usage: {
    posts: { current: number; limit: number | null };
    branches: { current: number; limit: number };
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
    branches: string;
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
    branches: { current: 3, limit: 5 },
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
      branches: '1 Branch',
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
      branches: 'Up to 5 Branches',
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
      branches: 'Unlimited Branches',
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

