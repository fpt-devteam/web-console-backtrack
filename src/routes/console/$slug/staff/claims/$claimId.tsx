import { StaffClaimDetailPage } from '@/pages/console/staff/staff-claim-detail.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/claims/$claimId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffClaimDetailPage />
}
