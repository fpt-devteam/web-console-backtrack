import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  Organization,
  MyOrganization,
} from '@/types/organization.types';

export const orgService = {
  async getMyOrgs(): Promise<MyOrganization[]> {
    const { data } = await privateClient.get<ApiResponse<MyOrganization[]>>('/api/core/orgs/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch organizations');
    return data.data ?? [];
  },

  async getById(orgId: string): Promise<Organization> {
    const { data } = await privateClient.get<ApiResponse<Organization>>(`/api/core/orgs/${orgId}`);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch organization');
    return data.data;
  },

  async update(orgId: string, payload: UpdateOrganizationPayload): Promise<Organization> {
    const { data } = await privateClient.put<ApiResponse<Organization>>(`/api/core/orgs/${orgId}`, payload);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update organization');
    return data.data;
  },

  async create(payload: CreateOrganizationPayload): Promise<Organization> {
    const { data } = await privateClient.post<ApiResponse<Organization>>('/api/core/orgs', payload);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create organization');
    return data.data;
  },
};
