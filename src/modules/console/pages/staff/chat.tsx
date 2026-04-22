/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Smile,
  UserCheck,
  X,
} from 'lucide-react'
import { StaffLayout } from '../../components/staff/layout'
import type { IConversation, IMessage } from '@/types/chat.types'
import { useChatContext } from '@/contexts/chat.context'
import {
  useAssignConversation,
  useChatAssigned,
  useChatMessages,
  useChatQueue,
  useChatResolved,
  useResolveConversation,
} from '@/hooks/use-chat'
import {
  useConversationUpdates,
  useIncomingMessages,
  useMarkSeen,
  useSendMessage,
  useTypingIndicator,
} from '@/hooks/use-chat-socket'
import { ConversationStatus, MessageType } from '@/types/chat.types'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { auth } from '@/lib/firebase'

// ── Helpers ──────────────────────────────────────────────

const AVATAR_COLORS = [
  '#E67E22', '#E74C3C', '#9B59B6', '#2980B9',
  '#27AE60', '#16A085', '#D35400', '#8E44AD',
  '#2471A3', '#1E8449',
]

function pickColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function Avatar({ url, name, className }: { url?: string | null; name: string; className: string }) {
  if (url) return <img src={url} alt={name} className={className} />
  return (
    <div
      className={`${className} flex items-center justify-center text-white font-semibold select-none`}
      style={{ backgroundColor: pickColor(name) }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Typing indicator — animated dots ────────────────────

function TypingIndicator({ conversationId }: { conversationId: string }) {
  const { typingUsers } = useChatContext()
  const active = Object.values(typingUsers).filter(t => t.conversationId === conversationId)
  if (!active.length) return null
  return (
    <div className="flex items-end gap-2 px-4 pb-3">
      <div className="flex items-center gap-1 bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Message group — consecutive messages from same sender ─

type MsgGroup = { senderId: string; messages: Array<IMessage> }

function buildGroups(messages: Array<IMessage>): Array<MsgGroup> {
  const groups: Array<MsgGroup> = []
  for (const msg of messages) {
    const last = groups[groups.length - 1]
    if (last && last.senderId === msg.senderId) {
      last.messages.push(msg)
    } else {
      groups.push({ senderId: msg.senderId, messages: [msg] })
    }
  }
  return groups
}

function bubbleClass(isOwn: boolean, pos: 'only' | 'first' | 'middle' | 'last') {
  const base = isOwn
    ? 'bg-blue-500 text-white'
    : 'bg-gray-100 text-gray-900'
  const radius: Record<string, string> = {
    only:   'rounded-2xl',
    first:  isOwn ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md',
    middle: isOwn ? 'rounded-2xl rounded-r-md'  : 'rounded-2xl rounded-l-md',
    last:   isOwn ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tl-md',
  }
  return `${base} ${radius[pos]}`
}

// ── Message panel ────────────────────────────────────────


function MessagePanel({ conversationId, partner, readOnly = false }: {
  conversationId: string
  partner?: { avatarUrl?: string | null; displayName?: string | null; email?: string | null } | null
  readOnly?: boolean
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatMessages(conversationId)
  const { send } = useSendMessage()
  const { startTyping, stopTyping } = useTypingIndicator()
  const markSeen = useMarkSeen()

  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const currentUid = auth.currentUser?.uid

  useIncomingMessages(conversationId)

  useEffect(() => {
    markSeen(conversationId)
  }, [conversationId, markSeen])

  const allMessages = data?.pages.flatMap(p => p.messages) ?? []
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    send({ conversationId, type: MessageType.TEXT, content: trimmed })
    stopTyping()
    setText('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  const groups = buildGroups([...allMessages].reverse())

  return (
    <div
      className="flex-1 grid min-h-0"
      style={{ gridTemplateRows: 'minmax(0, 1fr) auto' }}
    >
      {/* Messages — minmax(0,1fr) ensures bounded height regardless of content */}
      <div className="overflow-y-auto py-4 px-4 space-y-1 bg-white">
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

        {allMessages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">No messages yet.</p>
        )}

        {groups.map((group, gi) => {
          const isOwn = group.senderId === currentUid
          const count = group.messages.length
          return (
            <div key={gi} className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
              {group.messages.map((msg, mi) => {
                const pos: 'only' | 'first' | 'middle' | 'last' =
                  count === 1 ? 'only' : mi === 0 ? 'first' : mi === count - 1 ? 'last' : 'middle'
                const isLast = mi === count - 1
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[72%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isOwn && (
                      <div className="w-7 flex-shrink-0">
                        {isLast && (
                          <div className="w-7 h-7 rounded-full overflow-hidden">
                            <Avatar
                              url={partner?.avatarUrl}
                              name={partner?.displayName ?? partner?.email ?? msg.senderId.slice(0, 2)}
                              className="w-7 h-7 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`px-3.5 py-2 text-sm ${bubbleClass(isOwn, pos)}`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      {isLast && (
                        <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-blue-100 text-right' : 'text-gray-400'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Typing + Input — auto row, always visible at bottom */}
      <div>
        {!readOnly && <TypingIndicator conversationId={conversationId} />}
        {readOnly ? (
          <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-400">
            This conversation has been resolved.
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message…"
                value={text}
                onChange={e => { setText(e.target.value); startTyping() }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
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
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3">
          <Avatar url={conv.partner?.avatarUrl} name={label} className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
            {conv.lastMessageContent && (
              <p className="text-xs text-gray-500 truncate">{conv.lastMessageContent}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
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
    case ConversationStatus.QUEUE:       return 'bg-amber-100 text-amber-700'
    case ConversationStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700'
    case ConversationStatus.CLOSED:      return 'bg-green-100 text-green-700'
    default:                             return 'bg-gray-100 text-gray-600'
  }
}

function statusLabel(status: ConversationStatus | undefined) {
  switch (status) {
    case ConversationStatus.QUEUE:       return 'Queue'
    case ConversationStatus.IN_PROGRESS: return 'Active'
    case ConversationStatus.CLOSED:      return 'Closed'
    default: return status ?? ''
  }
}

function ConvItem({ conv, isActive, onSelect }: {
  conv: IConversation
  isActive: boolean
  onSelect: () => void
}) {
  const name = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
  const hasUnread = (conv.unreadCount ?? 0) > 0
  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left
        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      <div className="relative flex-shrink-0">
        <Avatar url={conv.partner?.avatarUrl} name={name} className="w-12 h-12 rounded-full" />
        {conv.status === ConversationStatus.IN_PROGRESS && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
            {name}
          </span>
          <span className="text-[11px] text-gray-400 flex-shrink-0">
            {formatTime(conv.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className={`text-xs truncate ${hasUnread ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
            {conv.lastMessageContent ?? 'No messages yet'}
          </p>
          {hasUnread && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {conv.unreadCount}
            </span>
          )}
        </div>

        {conv.status && (
          <span className={`text-[10px] font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${statusBadge(conv.status)}`}>
            {statusLabel(conv.status)}
          </span>
        )}
      </div>
    </button>
  )
}

// ── Main page ────────────────────────────────────────────

export function StaffChatPage() {
  const { currentOrgId } = useCurrentOrgId()
  const { activeConversationId, setActiveConversationId } = useChatContext()

  const [tab, setTab] = useState<'queue' | 'assigned' | 'resolved'>('assigned')
  const [searchTerm, setSearchTerm] = useState('')
  const [assignConfirmConv, setAssignConfirmConv] = useState<IConversation | null>(null)

  const queueQuery    = useChatQueue(currentOrgId ?? undefined, { poll: tab === 'queue' })
  const assignedQuery = useChatAssigned()
  const resolvedQuery = useChatResolved()
  const assignMutation  = useAssignConversation()
  const resolveMutation = useResolveConversation()

  useConversationUpdates()

  const queueList: Array<IConversation>    = Array.isArray(queueQuery.data)    ? queueQuery.data    : []
  const assignedList: Array<IConversation> = Array.isArray(assignedQuery.data) ? assignedQuery.data : []
  const resolvedList: Array<IConversation> = Array.isArray(resolvedQuery.data) ? resolvedQuery.data : []

  const conversations = tab === 'queue' ? queueList : tab === 'assigned' ? assignedList : resolvedList
  const isLoadingList = tab === 'queue' ? queueQuery.isLoading : tab === 'assigned' ? assignedQuery.isLoading : resolvedQuery.isLoading

  const filtered = conversations.filter(c => {
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
    assignMutation.mutate(assignConfirmConv.id, {
      onSuccess: () => {
        setAssignConfirmConv(null)
        setTab('assigned')
        setActiveConversationId(assignConfirmConv.id)
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

      <div className="h-full overflow-hidden flex bg-gray-50">

        {/* ── Left pane ── */}
        <div className="w-110 border-r border-gray-200 bg-white flex flex-col min-h-0">

          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-2 w-full">
              <button
                onClick={() => setTab('assigned')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'assigned' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Chats
              </button>
              <button
                onClick={() => setTab('queue')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'queue' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  Queue
                  {queueList.length > 0 && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {queueList.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setTab('resolved')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'resolved' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Resolved
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
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-2">
                <RefreshCw className="w-8 h-8 text-gray-200" />
                <p className="text-sm text-gray-400">
                  {tab === 'queue' ? 'No conversations in queue' : tab === 'assigned' ? 'No assigned conversations' : 'No resolved conversations'}
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

        {/* ── Right pane ── */}
        <div className="flex-1 flex flex-col bg-white min-h-0">
          {activeConversationId && activeConv ? (
            <>
              {/* Chat header */}
              <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar url={activeConv?.partner?.avatarUrl} name={partnerName} className="w-10 h-10 rounded-full" />
                    {!isResolved && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{partnerName}</h3>
                    <p className={`text-xs font-medium ${isResolved ? 'text-gray-400' : 'text-green-500'}`}>
                      {isResolved ? 'Resolved' : 'Active now'}
                    </p>
                  </div>
                </div>
                {!isResolved && (
                  <button
                    onClick={handleResolve}
                    disabled={resolveMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors disabled:opacity-60"
                  >
                    {resolveMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Resolve
                  </button>
                )}
              </div>

              {/* Messages (read-only for resolved) */}
              <MessagePanel conversationId={activeConversationId} partner={activeConv?.partner} readOnly={isResolved} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <Smile className="w-10 h-10 text-blue-300" />
              </div>
              <p className="text-base font-medium text-gray-700">No conversation selected</p>
              <p className="text-sm text-gray-400">Choose a chat from the left to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  )
}
