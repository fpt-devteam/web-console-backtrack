import { StaffChatBoardPage } from '@/modules/console/pages/staff'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/staff/chat-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffChatBoardPage />
}
