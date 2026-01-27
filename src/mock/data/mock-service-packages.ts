/**
 * Service package status type
 */
export type PackageStatus = 'Active' | 'Inactive' | 'Draft';

/**
 * Billing cycle type
 */
export type BillingCycle = 'Monthly' | 'Yearly';

/**
 * Feature interface
 */
export interface PackageFeature {
  id: string;
  name: string;
  included: boolean;
  limit?: string | number; // e.g., "100", "Unlimited", "5"
  description?: string;
}

/**
 * Service package interface
 */
export interface ServicePackage {
  id: string;
  name: string;
  tier: 'Basic' | 'Pro' | 'VIP';
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  status: PackageStatus;
  isPopular?: boolean;
  features: PackageFeature[];
  maxTenants?: number;
  maxUsers?: number;
  maxStorage?: number; // in GB
  supportLevel?: 'Basic' | 'Priority' | 'Dedicated';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock service packages data
 * 
 * Contains sample service package data for testing and development.
 * Includes Basic, Pro, and VIP packages with different features and pricing.
 */
export const mockServicePackages: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'Basic',
    description: 'Perfect for small organizations getting started with essential features.',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99, // ~17% discount
    status: 'Active',
    isPopular: false,
    maxTenants: 1,
    maxUsers: 50,
    maxStorage: 10,
    supportLevel: 'Basic',
    features: [
      { id: '1', name: 'Basic Analytics', included: true },
      { id: '2', name: 'Email Support', included: true },
      { id: '3', name: 'Standard QR Codes', included: true, limit: 100 },
      { id: '4', name: 'Basic API Access', included: true, limit: 1000 },
      { id: '5', name: 'Custom Branding', included: false },
      { id: '6', name: 'Advanced Analytics', included: false },
      { id: '7', name: 'Priority Support', included: false },
      { id: '8', name: 'SSO Integration', included: false },
      { id: '9', name: 'White Label', included: false },
      { id: '10', name: 'Dedicated Account Manager', included: false },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'Pro',
    description: 'Ideal for growing businesses with advanced features and priority support.',
    monthlyPrice: 99.99,
    yearlyPrice: 999.99, // ~17% discount
    status: 'Active',
    isPopular: true, // Most popular
    maxTenants: 5,
    maxUsers: 200,
    maxStorage: 100,
    supportLevel: 'Priority',
    features: [
      { id: '1', name: 'Advanced Analytics', included: true },
      { id: '2', name: 'Priority Email Support', included: true },
      { id: '3', name: 'Premium QR Codes', included: true, limit: 1000 },
      { id: '4', name: 'Full API Access', included: true, limit: 10000 },
      { id: '5', name: 'Custom Branding', included: true },
      { id: '6', name: 'Advanced Analytics', included: true },
      { id: '7', name: 'Priority Support', included: true },
      { id: '8', name: 'SSO Integration', included: true },
      { id: '9', name: 'White Label', included: false },
      { id: '10', name: 'Dedicated Account Manager', included: false },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'vip',
    name: 'VIP',
    tier: 'VIP',
    description: 'Enterprise-grade solution with unlimited features and dedicated support.',
    monthlyPrice: 299.99,
    yearlyPrice: 2999.99, // ~17% discount
    status: 'Active',
    isPopular: false,
    maxTenants: -1, // Unlimited
    maxUsers: -1, // Unlimited
    maxStorage: 1000,
    supportLevel: 'Dedicated',
    features: [
      { id: '1', name: 'Enterprise Analytics', included: true },
      { id: '2', name: '24/7 Dedicated Support', included: true },
      { id: '3', name: 'Unlimited QR Codes', included: true, limit: 'Unlimited' },
      { id: '4', name: 'Unlimited API Access', included: true, limit: 'Unlimited' },
      { id: '5', name: 'Custom Branding', included: true },
      { id: '6', name: 'Advanced Analytics', included: true },
      { id: '7', name: 'Priority Support', included: true },
      { id: '8', name: 'SSO Integration', included: true },
      { id: '9', name: 'White Label', included: true },
      { id: '10', name: 'Dedicated Account Manager', included: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-25'),
  },
];

