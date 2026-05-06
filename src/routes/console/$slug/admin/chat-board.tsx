import { AdminChatBoardPage } from '@/modules/console/pages/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/$slug/admin/chat-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminChatBoardPage />
}
