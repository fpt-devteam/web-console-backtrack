import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { CreateOrganizationPayload, Organization } from '@/types/organization.types';

export const orgService = {
  async create(payload: CreateOrganizationPayload): Promise<Organization> {
    const { data } = await privateClient.post<ApiResponse<Organization>>('/api/core/orgs', payload);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create organization');
    return data.data;
  },
};
