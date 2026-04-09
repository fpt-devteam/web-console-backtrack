import { useMutation } from '@tanstack/react-query';
import { returnReportService, type OwnerInfoPayload } from '@/services/return-report.service';

export function useCreateOrgReturnReport() {
  return useMutation({
    mutationFn: (args: { orgId: string; postId: string; ownerInfo?: OwnerInfoPayload | null }) =>
      returnReportService.createOrgReturnReport(args.orgId, { postId: args.postId, ownerInfo: args.ownerInfo }),
  });
}

