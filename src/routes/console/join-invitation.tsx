import { JoinInvitationPage } from '@/modules/console/pages/join-invitation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/join-invitation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <JoinInvitationPage />
}
