import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export function useActivityLogs(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['activity-logs', page, pageSize],
    queryFn: () => analyticsService.getActivityLogs(page, pageSize),
  });
}
