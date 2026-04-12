import { useMutation, useQuery } from '@tanstack/react-query';
import { returnReportService, type OwnerInfoPayload } from '@/services/return-report.service';

export function useCreateOrgReturnReport() {
  return useMutation({
    mutationFn: (args: { orgId: string; postId: string; ownerInfo?: OwnerInfoPayload | null }) =>
      returnReportService.createOrgReturnReport(args.orgId, { postId: args.postId, ownerInfo: args.ownerInfo }),
  });
}

export function useOrgReturnReports(orgId: string | null, page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['return-reports', 'org', orgId, page, pageSize],
    queryFn: () => returnReportService.getOrgReturnReports(orgId!, page, pageSize),
    enabled: !!orgId,
  });
}

