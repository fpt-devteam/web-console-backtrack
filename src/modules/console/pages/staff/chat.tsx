import { useState } from 'react'
import { Smile } from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import { AssignConfirmDialog } from '../../components/staff/chat/assign-confirm-dialog'
import { ChatHeader } from '../../components/staff/chat/chat-header'
import { ChatSidebar } from '../../components/staff/chat/chat-sidebar'
import { MessagePanel } from '../../components/staff/chat/message-panel'
import { PinnedPostCard } from '../../components/staff/chat/pinned-post-card'
import type { IConversation } from '@/types/chat.types'
import { useChatContext } from '@/contexts/chat.context'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import {
  useAssignConversation,
  useChatAssigned,
  useChatResolved,
  useResolveConversation,
} from '@/hooks/use-chat'
import { useConversationUpdates, useSocketChatQueue } from '@/hooks/use-chat-socket'

export function StaffChatPage() {
  const { currentOrgId } = useCurrentOrgId()
  const { activeConversationId, setActiveConversationId } = useChatContext()

  const [tab, setTab] = useState<'queue' | 'assigned' | 'resolved'>('assigned')
  const [searchTerm, setSearchTerm] = useState('')
  const [assignConfirmConv, setAssignConfirmConv] = useState<IConversation | null>(null)

  const { data: queueData, isLoading: isQueueLoading, removeFromQueue } = useSocketChatQueue(currentOrgId ?? undefined)
  const assignedQuery = useChatAssigned()
  const resolvedQuery = useChatResolved()
  const assignMutation  = useAssignConversation()
  const resolveMutation = useResolveConversation()

  useConversationUpdates()

  const queueList: Array<IConversation>    = Array.isArray(queueData) ? queueData : []
  const assignedList: Array<IConversation> = Array.isArray(assignedQuery.data) ? assignedQuery.data : []
  const resolvedList: Array<IConversation> = Array.isArray(resolvedQuery.data) ? resolvedQuery.data : []

  const allConversations = tab === 'queue' ? queueList : tab === 'assigned' ? assignedList : resolvedList
  const isLoadingList    = tab === 'queue' ? isQueueLoading : tab === 'assigned' ? assignedQuery.isLoading : resolvedQuery.isLoading

  const filtered = allConversations.filter(c => {
    if (!searchTerm) return true
    const name = (c.partner?.displayName ?? c.partner?.email ?? '').toLowerCase()
    return (
      name.includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lastMessageContent ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const activeConv  = [...assignedList, ...resolvedList].find(c => c.id === activeConversationId) ?? null
  const isResolved  = resolvedList.some(c => c.id === activeConversationId)
  const partnerName = activeConv?.partner?.displayName ?? activeConv?.partner?.email ?? (activeConversationId?.slice(0, 8) ?? '')

  function handleSelect(conv: IConversation) {
    if (tab === 'queue') setAssignConfirmConv(conv)
    else setActiveConversationId(conv.id)
  }

  function handleConfirmAssign() {
    if (!assignConfirmConv) return
    const convId = assignConfirmConv.id
    assignMutation.mutate(convId, {
      onSuccess: () => {
        removeFromQueue(convId)
        setAssignConfirmConv(null)
        setTab('assigned')
        setActiveConversationId(convId)
      },
    })
  }

  function handleResolve() {
    if (!activeConversationId) return
    resolveMutation.mutate(activeConversationId, {
      onSuccess: () => {
        setActiveConversationId(null)
        setTab('assigned')
      },
    })
  }

  return (
    <StaffLayout>
      {assignConfirmConv && (
        <AssignConfirmDialog
          conv={assignConfirmConv}
          isPending={assignMutation.isPending}
          onConfirm={handleConfirmAssign}
          onCancel={() => setAssignConfirmConv(null)}
        />
      )}

      <div className="h-full overflow-hidden flex bg-[#f7f7f7]">
        <ChatSidebar
          tab={tab}
          onTabChange={setTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          conversations={filtered}
          queueCount={queueList.length}
          isLoading={isLoadingList}
          activeConversationId={activeConversationId}
          onSelect={handleSelect}
        />

        <div className="flex-1 flex flex-col bg-white min-h-0">
          {activeConversationId && activeConv ? (
            <>
              <ChatHeader
                partnerName={partnerName}
                avatarUrl={activeConv.partner?.avatarUrl}
                isResolved={isResolved}
                isResolvePending={resolveMutation.isPending}
                onResolve={handleResolve}
              />
              {activeConv.postId && (
                <PinnedPostCard
                  postId={activeConv.postId}
                  orgSlug={activeConv.orgSlug ?? ''}
                />
              )}
              <MessagePanel
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
