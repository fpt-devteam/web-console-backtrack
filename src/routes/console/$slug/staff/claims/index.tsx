import { StaffClaimBoardPage } from '@/pages/console/staff/staff-claim-board.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/claims/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffClaimBoardPage />
}
