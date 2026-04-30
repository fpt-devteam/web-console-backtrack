import { FileSearch } from 'lucide-react'
import type { PostStatsResponse } from '@/services/staff-dashboard.service'

interface PostStatsPanelProps {
  data: PostStatsResponse
}

export function PostStatsPanel({ data }: PostStatsPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#222222]">My Posts in System</h2>
        <p className="text-xs text-[#929292] mt-0.5">Found posts I created</p>
      </div>

      <div className="rounded-xl bg-[#e8f9f0] p-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <FileSearch className="w-3.5 h-3.5 text-[#06c167]" />
          <span className="text-[11px] font-medium text-[#06c167]">Found Posts</span>
        </div>
        <span className="text-2xl font-bold text-[#222222] leading-none">{data.foundPosts}</span>
        <div className="flex items-center justify-between gap-3 text-[10px] text-[#929292]">
          <span>+{data.thisMonth.found} this month</span>
          <span className="font-semibold text-[#222222]">{data.total} total</span>
        </div>
      </div>
    </div>
  )
}
