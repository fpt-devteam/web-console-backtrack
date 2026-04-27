import { useState } from 'react'
import { ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react'
import type { StaffPerformanceItem } from '@/services/admin-dashboard.service'

const PAGE_SIZE = 3
const RANK_MEDAL = ['🥇', '🥈', '🥉']

function RateBar({ value }: { value: number }) {
  const color = value >= 85 ? '#06c167' : value >= 70 ? '#c97a00' : '#ff385c'
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-1.5 flex-1 rounded-full bg-[#f0f0f0] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-semibold flex-shrink-0" style={{ color }}>{value}%</span>
    </div>
  )
}

interface StaffPerformancePanelProps {
  data: Array<StaffPerformanceItem>
}

export function StaffPerformancePanel({ data }: StaffPerformancePanelProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageItems = data.slice(start, start + PAGE_SIZE)

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#222222]">Staff Performance</h2>
        <p className="text-xs text-[#929292] mt-0.5">Ranked by items logged this month</p>
      </div>

      <div className="space-y-3 flex-1 min-h-[168px]">
        {pageItems.map((staff) => {
          const globalIndex = start + pageItems.indexOf(staff)
          return (
            <div key={staff.id} className="flex items-center gap-3 rounded-xl hover:bg-[#fafafa] transition-colors px-2 py-1.5">
              <span className="text-base flex-shrink-0 w-6 text-center">
                {globalIndex < 3
                  ? RANK_MEDAL[globalIndex]
                  : <span className="text-xs text-[#929292] font-semibold">{globalIndex + 1}</span>
                }
              </span>

              <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#6a6a6a]">
                  {staff.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#222222] truncate">{staff.name}</p>
                <RateBar value={staff.returnRate} />
              </div>

              <div className="flex-shrink-0 text-right space-y-0.5">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-[#929292]" />
                  <span className="text-xs font-semibold text-[#222222]">{staff.itemsLogged}</span>
                </div>
                {staff.streak > 0 && (
                  <div className="flex items-center gap-1 justify-end">
                    <Flame className="w-3 h-3 text-[#c97a00]" />
                    <span className="text-[10px] text-[#c97a00] font-medium">{staff.streak}d</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-[#f7f7f7] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-[#929292]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06c167] inline-block" /> ≥85%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c97a00] inline-block" /> ≥70%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff385c] inline-block" /> &lt;70%</span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6a6a6a]" />
            </button>
            <span className="text-[11px] text-[#6a6a6a] min-w-[3rem] text-center">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6a6a6a]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
