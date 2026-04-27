import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { AdminSubscriptionResult, AdminPaymentHistoryItem } from '@/types/admin-user.types';

export interface SubscriptionPlanResult {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  subscriberType: 'User' | 'Organization';
  features: string[];
}

export interface SubscriptionPlanSnapshot {
  name: string;
  price: number;
  currency: string;
  billingInterval: 'Monthly' | 'Yearly';
  features: string[];
}

export interface SubscriptionResult {
  id: string;
  subscriberType: 'User' | 'Organization';
  userId?: string;
  organizationId?: string;
  planId: string;
  planSnapshot: SubscriptionPlanSnapshot;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  clientSecret?: string; // Stripe PaymentIntent secret — only present on creation
}

export const subscriptionService = {
  /**
   * Get all subscription plans for a subscriber type
   */
  async getPlans(subscriberType: 'User' | 'Organization' = 'Organization'): Promise<SubscriptionPlanResult[]> {
    const { data } = await privateClient.get<ApiResponse<SubscriptionPlanResult[] | null>>(
      `/api/core/subscription-plans?subscriberType=${subscriberType}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subscription plans');
    return data.data ?? [];
  },

  /**
   * Get current active subscription for Org/User
   */
  async getSubscription(): Promise<SubscriptionResult | null> {
    try {
      const { data } = await privateClient.get<ApiResponse<SubscriptionResult>>(
        '/api/core/subscriptions/me'
      );
      if (!data.success) return null;
      return data.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  /**
   * Create a new subscription for an organization.
   * Response includes a Stripe `clientSecret` for payment confirmation.
   */
  async createSubscription(planId: string, organizationId: string): Promise<SubscriptionResult> {
    const { data } = await privateClient.post<ApiResponse<SubscriptionResult>>(
      '/api/core/subscriptions',
      { planId, organizationId },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },

  /**
   * Cancel an organization's subscription.
   * cancelAtPeriodEnd=true keeps access until billing period ends (soft cancel).
   * cancelAtPeriodEnd=false ends immediately.
   */
  async cancelSubscription(organizationId: string, cancelAtPeriodEnd = false): Promise<void> {
    const { data } = await privateClient.delete<ApiResponse<unknown>>(
      '/api/core/subscriptions/me',
      { data: { organizationId, cancelAtPeriodEnd } },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to cancel subscription');
  },

  /**
   * Get current subscription for a specific organization
   */
  async getOrgSubscription(organizationId: string): Promise<AdminSubscriptionResult | null> {
    try {
      const { data } = await privateClient.get<ApiResponse<AdminSubscriptionResult>>(
        `/api/core/subscriptions/me?organizationId=${organizationId}`
      );
      if (!data.success) return null;
      return data.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  /**
   * Create a Stripe Customer Portal session and return the hosted URL.
   * The user is redirected to this URL to update their payment method.
   */
  async createCustomerPortalSession(organizationId: string, returnUrl: string): Promise<string> {
    const { data } = await privateClient.post<ApiResponse<{ url: string }>>(
      '/api/core/subscriptions/customer-portal',
      { organizationId, returnUrl },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to open billing portal');
    return data.data.url;
  },

  /**
   * Get payment history for a specific organization
   */
  async getOrgPaymentHistory(organizationId: string): Promise<AdminPaymentHistoryItem[]> {
    const { data } = await privateClient.get<ApiResponse<AdminPaymentHistoryItem[] | { items: AdminPaymentHistoryItem[]; total: number } | null>>(
      `/api/core/subscriptions/payments?organizationId=${organizationId}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch payment history');
    const result = data.data;
    if (!result) return [];
    if (Array.isArray(result)) return result;
    return result.items ?? [];
  },
};
