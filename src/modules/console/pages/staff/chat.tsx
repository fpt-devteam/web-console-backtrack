/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  RefreshCw,
  Search,
  Smile,
  UserCheck,
  X,
} from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import type {IConversation} from '@/types/chat.types';
import { useChatContext } from '@/contexts/chat.context'
import {
  useAssignConversation,
  useChatAssigned,
  useChatMessages,
  useChatQueue,
} from '@/hooks/use-chat'
import {
  useConversationUpdates,
  useIncomingMessages,
  useMarkSeen,
  useSendMessage,
  useTypingIndicator,
} from '@/hooks/use-chat-socket'
import { ConversationStatus,  MessageType } from '@/types/chat.types'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { auth } from '@/lib/firebase'

// ── Helpers ─────────────────────────────────────────────

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Typing indicator ─────────────────────────────────────

function TypingIndicator({ conversationId }: { conversationId: string }) {
  const { typingUsers } = useChatContext()
  const active = Object.values(typingUsers).filter(
    (t) => t.conversationId === conversationId
  )
  if (!active.length) return null
  const names = active.map((t) => t.displayName ?? 'Someone')
  return (
    <div className="px-7 pb-2 text-xs text-gray-400 italic">
      {names.join(', ')} {names.length === 1 ? 'is' : 'are'} typing…
    </div>
  )
}

// ── Message panel ────────────────────────────────────────

function MessagePanel({ conversationId }: { conversationId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(conversationId)
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()

  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const currentUid = auth.currentUser?.uid

  // Subscribe to real-time messages for this conversation
  useIncomingMessages(conversationId)

  // Mark seen when the panel mounts or conversation changes
  useEffect(() => {
    markSeen(conversationId)
  }, [conversationId, markSeen])

  // Scroll to bottom on new messages
  const allMessages = data?.pages.flatMap((p) => p.messages) ?? []
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    send({ conversationId, type: MessageType.TEXT, content: trimmed })
    stopTyping()
    setText('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <>
      {/* Load older messages */}
      {hasNextPage && (
        <div className="text-center py-2">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs text-blue-500 hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 px-7 space-y-4 bg-gray-50">
        {allMessages.length === 0 && (
          <p className="text-center text-sm text-gray-400">No messages yet.</p>
        )}

        {[...allMessages].reverse().map((msg) => {
          const isOwn = msg.senderId === currentUid
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] ${
                  isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                } rounded-lg px-4 py-2`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Typing */}
      <TypingIndicator conversationId={conversationId} />

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type your message…"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              startTyping()
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}

// ── Assign confirm dialog ────────────────────────────────

function AssignConfirmDialog({
  conv,
  isPending,
  onConfirm,
  onCancel,
}: {
  conv: IConversation
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const label = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Assign conversation?</h3>
              <p className="text-xs text-gray-500 mt-0.5">This will assign the chat to you</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-5">
          <div className="flex items-center gap-2">
            <img
              src={conv.partner?.avatarUrl ?? avatarUrl(label)}
              alt={label}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
              {conv.lastMessageContent && (
                <p className="text-xs text-gray-500 truncate">{conv.lastMessageContent}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Assigning…</>
            ) : (
              <><UserCheck className="w-4 h-4" /> Assign to me</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Conversation list item ────────────────────────────────

function statusBadge(status: ConversationStatus | undefined) {
  switch (status) {
    case ConversationStatus.QUEUE:
      return 'bg-yellow-100 text-yellow-700'
    case ConversationStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-700'
    case ConversationStatus.CLOSED:
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function statusLabel(status: ConversationStatus | undefined) {
  switch (status) {
    case ConversationStatus.QUEUE:      return 'Queue'
    case ConversationStatus.IN_PROGRESS: return 'In Progress'
    case ConversationStatus.CLOSED:     return 'Closed'
    default: return status ?? ''
  }
}

function ConvItem({
  conv,
  isActive,
  onSelect,
}: {
  conv: IConversation
  isActive: boolean
  onSelect: () => void
}) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const label = (conv.partner?.displayName ?? conv.partner?.email ?? conv.id ?? 'user').slice(0, 8)
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
        isActive ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={conv.partner?.avatarUrl ?? avatarUrl(label)}
          alt={label}
          className="w-12 h-12 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {conv.partner?.displayName ?? conv.partner?.email ?? label}
            </span>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              {(conv.unreadCount ?? 0) > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatTime(conv.lastMessageAt)}
              </span>
            </div>
          </div>
          <p className="text-sm truncate text-gray-500">
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>
          {conv.status && (
            <span className={`text-xs font-medium mt-0.5 inline-block px-1.5 py-0.5 rounded-full ${statusBadge(conv.status)}`}>
              {statusLabel(conv.status)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ── Main page ────────────────────────────────────────────

export function StaffChatPage() {
  const { currentOrgId } = useCurrentOrgId()
  const { activeConversationId, setActiveConversationId, isConnected } = useChatContext()

  const [tab, setTab] = useState<'queue' | 'assigned'>('assigned')
  const [searchTerm, setSearchTerm] = useState('')
  const [assignConfirmConv, setAssignConfirmConv] = useState<IConversation | null>(null)

  const queueQuery = useChatQueue(currentOrgId ?? undefined)
  const assignedQuery = useChatAssigned()
  const assignMutation = useAssignConversation()

  // Keep conversation list up-to-date via socket events
  useConversationUpdates()

  const queueList: Array<IConversation> = Array.isArray(queueQuery.data) ? queueQuery.data : []
  const assignedList: Array<IConversation> = Array.isArray(assignedQuery.data) ? assignedQuery.data : []

  const conversations = tab === 'queue' ? queueList : assignedList
  const isLoadingList = tab === 'queue' ? queueQuery.isLoading : assignedQuery.isLoading

  const filtered = conversations.filter((c) => {
    if (!searchTerm) return true
    const name = (c.partner?.displayName ?? c.partner?.email ?? '').toLowerCase()
    return (
      name.includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lastMessageContent ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  function handleSelect(conv: IConversation) {
    if (tab === 'queue') {
      setAssignConfirmConv(conv)
    } else {
      setActiveConversationId(conv.id)
    }
  }

  function handleConfirmAssign() {
    if (!assignConfirmConv) return
    assignMutation.mutate(assignConfirmConv.id, {
      onSuccess: () => {
        setAssignConfirmConv(null)
        setTab('assigned')
        setActiveConversationId(assignConfirmConv.id)
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
      <div className="h-[calc(100vh-4rem)] flex">
        {/* ── Left pane — conversation list ── */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Customer Chat</h2>
              {/* Connection indicator */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Live' : 'Connecting…'}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setTab('assigned')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'assigned'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Chats
              </button>
              <button
                onClick={() => setTab('queue')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'queue'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Queue
                {queueList.length > 0 && (
                  <span className="ml-1.5 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {queueList.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <RefreshCw className="w-8 h-8 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  {tab === 'queue' ? 'No conversations in queue' : 'No assigned conversations'}
                </p>
              </div>
            ) : (
              filtered.map((conv, idx) => (
                <ConvItem
                  key={conv.id ?? String(idx)}
                  conv={conv}
                  isActive={activeConversationId === conv.id}
                  onSelect={() => handleSelect(conv)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right pane — active conversation ── */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversationId && assignedList.some((c) => c.id === activeConversationId) ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl(activeConversationId.slice(0, 8))}
                    alt="chat"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {activeConversationId.slice(0, 8)}
                    </h3>
                    <p className="text-xs text-blue-500">{activeConversationId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* Messages */}
              <MessagePanel conversationId={activeConversationId} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Smile className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-gray-500 text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  )
}
