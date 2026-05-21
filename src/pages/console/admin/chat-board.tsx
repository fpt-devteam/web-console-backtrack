import { Layout } from '@/components/console/admin/layout'
import { ClaimBoard } from '@/components/common/claim/claim-board'
import { useConversationUpdates } from '@/hooks/use-chat-socket'

export function AdminChatBoardPage() {
  useConversationUpdates()

  return (
    <Layout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 shrink-0">
          <h1 className="text-2xl font-bold text-ink">Chat Board</h1>
          <p className="text-sm text-mute mt-1">
            Drag conversations between columns to manage their status.
          </p>
        </div>
        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 pb-6">
          <ClaimBoard />
        </div>
      </div>
    </Layout>
  )
}
