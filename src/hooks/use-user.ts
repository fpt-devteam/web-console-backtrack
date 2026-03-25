import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UpdateProfilePayload } from '@/services/user.service';

export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMe(),
  });
}

export function useUpsertUser() {
  return useMutation({
    mutationFn: () => userService.upsertUser(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'me'] }),
  });
}
