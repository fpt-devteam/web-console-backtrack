import { StaffClaimBoardPage } from '@/pages/console/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/claim-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffClaimBoardPage />
}
