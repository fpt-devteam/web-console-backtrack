import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';

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
  status: string; // e.g. "Active", "Canceled"
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export const subscriptionService = {
  /**
   * Get all subscription plans
   * 
   * @param subscriberType - 0 for User, 1 for Organization
   */
  async getPlans(subscriberType: 0 | 1 = 1): Promise<SubscriptionPlanResult[]> {
    const { data } = await privateClient.get<ApiResponse<SubscriptionPlanResult[]>>(
      `/api/core/subscription-plans?subscriberType=${subscriberType}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch subscription plans');
    return data.data;
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
   * Create a new subscription
   */
  async createSubscription(planId: string): Promise<SubscriptionResult> {
    const { data } = await privateClient.post<ApiResponse<SubscriptionResult>>('/api/core/subscriptions', { planId });
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create subscription');
    return data.data;
  },

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<SubscriptionResult> {
    const { data } = await privateClient.delete<ApiResponse<SubscriptionResult>>('/api/core/subscriptions/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to cancel subscription');
    return data.data;
  },
};
