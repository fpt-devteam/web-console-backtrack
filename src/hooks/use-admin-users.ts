import { useQuery } from '@tanstack/react-query';
import { adminUserService, type GetAdminUsersParams } from '@/services/admin-user.service';

export function useAdminUsers(params: GetAdminUsersParams) {
  const { page = 1, pageSize = 20, search, status } = params;
  return useQuery({
    queryKey: ['admin', 'users', page, pageSize, search ?? '', status ?? 'all'],
    queryFn: () => adminUserService.getUsers({ page, pageSize, search, status }),
  });
}

export function useAdminUserDetail(userId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'users', 'detail', userId],
    queryFn: () => adminUserService.getUserById(userId!),
    enabled: Boolean(userId?.length),
  });
}
