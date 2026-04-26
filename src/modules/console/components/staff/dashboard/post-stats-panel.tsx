import { FileSearch, MapPin } from 'lucide-react'
import type { PostStatsResponse } from '@/services/staff-dashboard.service'

interface PostStatsPanelProps {
  data: PostStatsResponse
}

export function PostStatsPanel({ data }: PostStatsPanelProps) {
  const lostPct = data.total > 0 ? Math.round((data.lostPosts / data.total) * 100) : 0
  const foundPct = 100 - lostPct

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#222222]">My Posts in System</h2>
        <p className="text-xs text-[#929292] mt-0.5">Lost & Found posts I created</p>
      </div>

      {/* Two stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#fff8e6] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c97a00]" />
            <span className="text-[11px] font-medium text-[#c97a00]">Lost Posts</span>
          </div>
          <span className="text-2xl font-bold text-[#222222] leading-none">{data.lostPosts}</span>
          <span className="text-[10px] text-[#929292]">+{data.thisMonth.lost} this month</span>
        </div>

        <div className="rounded-xl bg-[#e8f9f0] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <FileSearch className="w-3.5 h-3.5 text-[#06c167]" />
            <span className="text-[11px] font-medium text-[#06c167]">Found Posts</span>
          </div>
          <span className="text-2xl font-bold text-[#222222] leading-none">{data.foundPosts}</span>
          <span className="text-[10px] text-[#929292]">+{data.thisMonth.found} this month</span>
        </div>
      </div>

      {/* Proportion bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-[#929292] mb-1.5">
          <span>Lost {lostPct}%</span>
          <span className="font-semibold text-[#222222]">{data.total} total</span>
          <span>Found {foundPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f7f7f7] overflow-hidden flex">
          <div
            className="h-full bg-[#c97a00] rounded-full transition-all"
            style={{ width: `${lostPct}%` }}
          />
          <div
            className="h-full bg-[#06c167] flex-1 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
