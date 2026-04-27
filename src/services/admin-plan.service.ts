import type { ApiResponse } from '@/types/api-response.type';
import type { AdminPlan, AdminPlansGrouped, CreatePlanRequest } from '@/types/admin-user.types';
import { privateClient } from '@/lib/api-client';

export const adminPlanService = {
  async getPlans(): Promise<AdminPlansGrouped> {
    const { data } = await privateClient.get<ApiResponse<AdminPlansGrouped>>(
      '/api/core/admin/subscription-plans',
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch plans');
    return data.data;
  },

  async createPlan(body: CreatePlanRequest): Promise<AdminPlan> {
    const { data } = await privateClient.post<ApiResponse<AdminPlan>>(
      '/api/core/admin/subscription-plans',
      body,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create plan');
    return data.data;
  },

  async updateFeatures(planId: string, features: Array<string>): Promise<AdminPlan> {
    const { data } = await privateClient.patch<ApiResponse<AdminPlan>>(
      `/api/core/admin/subscription-plans/${planId}/features`,
      { features },
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update features');
    return data.data;
  },

  async archivePlan(planId: string): Promise<void> {
    const { data } = await privateClient.delete<ApiResponse<unknown>>(
      `/api/core/admin/subscription-plans/${planId}`,
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to archive plan');
  },
};
