import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

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
