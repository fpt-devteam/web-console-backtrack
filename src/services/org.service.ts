import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { PagedResponse } from '@/types/pagination.type';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  Organization,
  MyOrganization,
  OrgMember,
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

  async getMembers(orgId: string, page = 1, pageSize = 20): Promise<PagedResponse<OrgMember>> {
    const { data } = await privateClient.get<ApiResponse<PagedResponse<OrgMember>>>(
      `/api/core/orgs/${orgId}/members`,
      { params: { page, pageSize } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch members');
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

  async updateMemberRole(orgId: string, membershipId: string, role: string): Promise<OrgMember> {
    const { data } = await privateClient.put<ApiResponse<OrgMember>>(
      `/api/core/orgs/${orgId}/members/${membershipId}/role`,
      { role }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update role');
    return data.data;
  },
};
