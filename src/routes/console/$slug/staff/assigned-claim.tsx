import { createFileRoute } from '@tanstack/react-router'
import { StaffAssignedClaimPage } from '@/pages/console/staff/staff-assigned-claim.page'

export const Route = createFileRoute('/console/$slug/staff/assigned-claim')({
  component: StaffAssignedClaimPage,
})
