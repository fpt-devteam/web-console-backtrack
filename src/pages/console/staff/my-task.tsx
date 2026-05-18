import { useState } from 'react'
import { Smile } from 'lucide-react'
import { StaffLayout } from '@/components/console/staff/layout'
import { TaskResolveDialog } from '@/components/console/staff/my-task/task-resolve-dialog'
import { TaskHeader } from '@/components/console/staff/my-task/task-header'
import { TaskSidebar } from '@/components/console/staff/my-task/task-sidebar'
import { TaskConversation } from '@/components/console/staff/my-task/task-conversation'
import { TaskPinnedItem } from '@/components/console/staff/my-task/task-pinned-item'
import type { IConversation } from '@/types/chat.types'
import { useChatContext } from '@/contexts/chat.context'
import {
  useChatAssigned,
  useResolveConversation,
} from '@/hooks/use-chat'
import { useConversationUpdates } from '@/hooks/use-chat-socket'

export function StaffMyTaskPage() {
  const { activeConversationId, setActiveConversationId } = useChatContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false)

  const assignedQuery = useChatAssigned({ isMe: true })
  const resolveMutation = useResolveConversation()

  useConversationUpdates()

  const assignedList: Array<IConversation> = Array.isArray(assignedQuery.data) ? assignedQuery.data : []

  const filtered = assignedList.filter(c => {
    if (!searchTerm) return true
    const name = (c.partner?.displayName ?? c.partner?.email ?? '').toLowerCase()
    return (
      name.includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lastMessageContent ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const activeConv  = [...assignedList].find(c => c.id === activeConversationId) ?? null
  const isResolved  = false
  const partnerName = activeConv?.partner?.displayName ?? activeConv?.partner?.email ?? (activeConversationId?.slice(0, 8) ?? '')

  function handleResolve() {
    setResolveConfirmOpen(true)
  }

  function handleConfirmResolve() {
    if (!activeConversationId) return
    resolveMutation.mutate(activeConversationId, {
      onSuccess: () => {
        setResolveConfirmOpen(false)
        setActiveConversationId(null)
      },
    })
  }

  return (
    <StaffLayout>
      {resolveConfirmOpen && (
        <TaskResolveDialog
          partnerName={partnerName}
          avatarUrl={activeConv?.partner?.avatarUrl ?? undefined}
          isPending={resolveMutation.isPending}
          onConfirm={handleConfirmResolve}
          onCancel={() => setResolveConfirmOpen(false)}
        />
      )}

      <div className="h-full overflow-hidden flex bg-[#f7f7f7]">
        <TaskSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          conversations={filtered}
          queueCount={assignedList.length}
          isLoading={assignedQuery.isLoading}
          activeConversationId={activeConversationId}
          onSelect={(conv) => setActiveConversationId(conv.id)}
        />

        <div className="flex-1 flex flex-col bg-white min-h-0">
          {activeConversationId && activeConv ? (
            <>
              <TaskHeader
                partnerName={partnerName}
                avatarUrl={activeConv.partner?.avatarUrl}
                isResolved={isResolved}
                isResolvePending={resolveMutation.isPending}
                onResolve={handleResolve}
              />
              {activeConv.supportFormData && (
                <TaskPinnedItem
                  supportFormData={activeConv.supportFormData}
                />
              )}
              <TaskConversation
                conversationId={activeConversationId}
                partner={activeConv.partner}
                readOnly={isResolved}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
              <div className="w-20 h-20 bg-[#f7f7f7] rounded-full flex items-center justify-center">
                <Smile className="w-10 h-10 text-[#929292]" />
              </div>
              <p className="text-base font-medium text-[#222222]">No conversation selected</p>
              <p className="text-sm text-[#929292]">Choose a chat from the left to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  )
}
