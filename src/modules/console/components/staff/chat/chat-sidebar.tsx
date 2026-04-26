import { Loader2, RefreshCw, Search } from 'lucide-react'
import { ConvItem } from './conv-item'
import type { IConversation } from '@/types/chat.types'

type Tab = 'queue' | 'assigned' | 'resolved'

interface ChatSidebarProps {
  tab: Tab
  onTabChange: (tab: Tab) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  conversations: Array<IConversation>
  queueCount: number
  isLoading: boolean
  activeConversationId: string | null
  onSelect: (conv: IConversation) => void
}

export function ChatSidebar({
  tab,
  onTabChange,
  searchTerm,
  onSearchChange,
  conversations,
  queueCount,
  isLoading,
  activeConversationId,
  onSelect,
}: ChatSidebarProps) {
  const emptyLabel =
    tab === 'queue' ? 'No conversations in queue'
    : tab === 'assigned' ? 'No assigned conversations'
    : 'No resolved conversations'

  return (
    <div className="w-110 border-r border-[#dddddd] bg-white flex flex-col min-h-0">
      <div className="px-4 pt-5 pb-3 border-b border-[#dddddd]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#222222]">Messages</h2>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
          <input
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f7f7f7] rounded-full text-sm text-[#222222] placeholder-[#929292] focus:outline-none focus:border-[#222222]"
          />
        </div>

        <div className="flex bg-[#f7f7f7] rounded-xl p-1 gap-2 w-full">
          <button
            onClick={() => onTabChange('assigned')}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'assigned' ? 'bg-white text-[#222222] shadow-sm' : 'text-[#929292] hover:text-[#6a6a6a]'
            }`}
          >
            My Chats
          </button>
          <button
            onClick={() => onTabChange('queue')}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'queue' ? 'bg-white text-[#222222] shadow-sm' : 'text-[#929292] hover:text-[#6a6a6a]'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              Queue
              {queueCount > 0 && (
                <span className="bg-[#c97a00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {queueCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => onTabChange('resolved')}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'resolved' ? 'bg-white text-[#222222] shadow-sm' : 'text-[#929292] hover:text-[#6a6a6a]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#ff385c]" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-2">
            <RefreshCw className="w-8 h-8 text-[#dddddd]" />
            <p className="text-sm text-[#929292]">{emptyLabel}</p>
          </div>
        ) : (
          conversations.map((conv, idx) => (
            <ConvItem
              key={conv.id ?? String(idx)}
              conv={conv}
              isActive={activeConversationId === conv.id}
              onSelect={() => onSelect(conv)}
            />
          ))
        )}
      </div>
    </div>
  )
}
