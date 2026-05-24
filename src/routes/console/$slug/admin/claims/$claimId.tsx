import { AdminClaimDetailPage } from '@/pages/console/admin/admin-claim-detail.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/claims/$claimId')({
  component: AdminClaimDetailPage,
})
