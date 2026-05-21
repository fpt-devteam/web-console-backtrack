import { AdminClaimBoardPage } from '@/pages/console/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/claim-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminClaimBoardPage />
}
