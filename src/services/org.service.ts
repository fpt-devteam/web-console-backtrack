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
    const body = {
      name: payload.name,
      slug: payload.slug,
      displayAddress: payload.displayAddress ?? undefined,
      location: payload.location
        ? { latitude: payload.location.latitude, longitude: payload.location.longitude }
        : undefined,
      externalPlaceId: payload.externalPlaceId ?? undefined,
      phone: payload.phone,
      contactEmail: payload.contactEmail?.trim() || undefined,
      industryType: payload.industryType,
      taxIdentificationNumber: payload.taxIdentificationNumber,
      locationNote: payload.locationNote !== undefined && payload.locationNote !== null
        ? payload.locationNote
        : undefined,
      businessHours: payload.businessHours ?? undefined,
      logoUrl: payload.logoUrl ?? undefined,
      coverImageUrl: payload.coverImageUrl ?? undefined,
      requiredFinderContactFields: payload.requiredFinderContactFields ?? undefined,
    };
    const { data } = await privateClient.put<ApiResponse<Organization>>(`/api/core/orgs/${orgId}`, body);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update organization');
    return data.data;
  },

  async create(payload: CreateOrganizationPayload): Promise<Organization> {
    const body = {
      name: payload.name,
      slug: payload.slug,
      displayAddress: payload.displayAddress,
      location: {
        latitude: payload.location.latitude,
        longitude: payload.location.longitude,
      },
      externalPlaceId: payload.externalPlaceId ?? undefined,
      phone: payload.phone,
      contactEmail: payload.contactEmail?.trim() || undefined,
      industryType: payload.industryType,
      taxIdentificationNumber: payload.taxIdentificationNumber,
      logoUrl: payload.logoUrl,
      requiredFinderContactFields: payload.requiredFinderContactFields,
    };
    const { data } = await privateClient.post<ApiResponse<Organization>>('/api/core/orgs', body);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create organization');
    return data.data;
  },

  async updateMemberRole(orgId: string, membershipId: string, role: string): Promise<OrgMember> {
    try {
      const { data } = await privateClient.put<ApiResponse<OrgMember>>(
        `/api/core/orgs/${orgId}/members/${membershipId}/role`,
        { role }
      );
      if (!data.success) throw new Error(data.error?.message ?? 'Failed to update role');
      return data.data;
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: ApiResponse<unknown> } };
      const body = ax.response?.data;
      const backendMessage = body?.error?.message;
      if (backendMessage) throw new Error(backendMessage);
      if (ax.response?.status === 400) {
        throw new Error(
          'The organization must have at least one admin. You cannot change the last admin to Staff.'
        );
      }
      throw err;
    }
  },

  async removeMember(orgId: string, membershipId: string): Promise<void> {
    await privateClient.delete(`/api/core/orgs/${orgId}/members/${membershipId}`);
  },
};
