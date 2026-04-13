import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { AdminPagedResult, AdminUserDetail, AdminUserSummary } from '@/types/admin-user.types';

export type GetAdminUsersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  /** Omit when showing all statuses */
  status?: 'Active' | 'Inactive';
};

export const adminUserService = {
  async getUsers(params: GetAdminUsersParams = {}): Promise<AdminPagedResult<AdminUserSummary>> {
    const { page = 1, pageSize = 20, search, status } = params;
    const { data } = await privateClient.get<ApiResponse<AdminPagedResult<AdminUserSummary>>>(
      '/api/core/admin/users',
      {
        params: {
          page,
          pageSize,
          search: search?.trim() ? search.trim() : undefined,
          status: status ?? undefined,
        },
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch users');
    return data.data;
  },

  async getUserById(
    userId: string,
    params: { billingPage?: number; billingPageSize?: number } = {}
  ): Promise<AdminUserDetail> {
    const { billingPage = 1, billingPageSize = 20 } = params;
    const { data } = await privateClient.get<ApiResponse<AdminUserDetail>>(
      `/api/core/admin/users/${encodeURIComponent(userId)}`,
      { params: { billingPage, billingPageSize } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch user');
    return data.data;
  },
};
