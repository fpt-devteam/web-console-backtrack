import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { UserProfile } from '@/types/user.types';

export interface UpdateProfilePayload {
  phone?: string | null;
  avatarUrl?: string | null;
  showEmail?: boolean;
  showPhone?: boolean;
}

export const userService = {
  async getMe(): Promise<UserProfile> {
    const { data } = await privateClient.get<ApiResponse<UserProfile>>('/api/core/users/me');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch user profile');
    // BE payloads may vary (id vs userId vs uid). Normalize to `UserProfile.id`.
    const raw = data.data as unknown as Record<string, unknown>;
    const id =
      (raw?.id as string | undefined) ??
      (raw?.userId as string | undefined) ??
      (raw?.uid as string | undefined);
    const d = raw as unknown as UserProfile;
    return { ...d, id: id ?? d.id, name: d.displayName ?? d.name ?? null };
  },

  async upsertUser(): Promise<UserProfile> {
    const { data } = await privateClient.post<ApiResponse<UserProfile>>('/api/core/users');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to upsert user');
    return data.data;
  },

  async createUser(): Promise<UserProfile> {
    const { data } = await privateClient.post<ApiResponse<UserProfile>>('/api/core/users');
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create user');
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const { data } = await privateClient.patch<ApiResponse<UserProfile>>('/api/core/users/me', payload);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to update profile');
    return data.data;
  },
};
