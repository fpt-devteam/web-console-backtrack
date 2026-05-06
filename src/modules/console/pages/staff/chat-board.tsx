import { StaffLayout } from '../../components/staff/layout'
import { ChatKanbanBoard } from '../../components/chat-board/kanban-board'
import { useConversationUpdates } from '@/hooks/use-chat-socket'

export function StaffChatBoardPage() {
  useConversationUpdates()

  return (
    <StaffLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-ink">Chat Board</h1>
          <p className="text-sm text-mute mt-1">
            Drag conversations between columns to manage their status.
          </p>
        </div>
        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 pb-6">
          <ChatKanbanBoard />
        </div>
      </div>
    </StaffLayout>
  )
}
