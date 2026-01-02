import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => analyticsService.getDashboardStats(),
  });
}
