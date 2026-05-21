import { Loader2, RefreshCw, Search } from 'lucide-react'
import { ClaimItem } from './claim-item'
import type { IConversation } from '@/types/chat.types'

interface ClaimSidebarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  conversations: Array<IConversation>
  queueCount: number
  isLoading: boolean
  activeConversationId: string | null
  onSelect: (conv: IConversation) => void
}

export function ClaimSidebar({
  searchTerm,
  onSearchChange,
  conversations,
  queueCount: _queueCount,
  isLoading,
  activeConversationId,
  onSelect,
}: ClaimSidebarProps) {
  const emptyLabel = 'No conversations found'

  return (
    <div className="w-110 border-r border-hairline bg-white flex flex-col min-h-0">
      <div className="px-4 pt-5 pb-3 border-b border-[#dddddd]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">My claim requests handling</h2>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mute" />
          <input
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cloud rounded-full text-base text-ink placeholder-mute focus:outline-none"
          />
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
          conversations.map((conv) => (
            <ClaimItem
              key={conv.id}
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
