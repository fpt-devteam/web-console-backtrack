import { StaffLayout } from '@/components/console/staff/layout'
import { ClaimBoard } from '@/components/common/claim/claim-board'
import { useConversationUpdates } from '@/hooks/use-chat-socket'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function StaffClaimBoardPage() {
  useConversationUpdates()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <StaffLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex-shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink">Claim Board</h1>
              <p className="text-sm text-mute mt-1">
                Drag conversations between columns to manage their status.
              </p>
            </div>

            <div className="relative w-full sm:w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mute" />
              <input
                type="text"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cloud rounded-full text-base text-ink placeholder-mute focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 pb-6">
          <ClaimBoard searchTerm={searchTerm} />
        </div>
      </div>
    </StaffLayout>
  )
}
