import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import type { DashboardInventoryItem } from '@/services/staff-dashboard.service'

const STATUS_STYLE: Record<string, string> = {
  InStorage:       'bg-[#f7f7f7] text-[#6a6a6a]',
  Active:          'bg-[#fff0f2] text-[#ff385c]',
  ReturnScheduled: 'bg-[#fff8e6] text-[#c97a00]',
  Returned:        'bg-[#e8f9f0] text-[#06c167]',
  Archived:        'bg-[#f7f7f7] text-[#929292]',
  Expired:         'bg-[#fde8e8] text-[#c13515]',
}

const STATUS_LABEL: Record<string, string> = {
  InStorage:       'In Storage',
  Active:          'Active',
  ReturnScheduled: 'Scheduled',
  Returned:        'Returned',
  Archived:        'Archived',
  Expired:         'Expired',
}

function RecentItemRow({ item, slug }: { item: DashboardInventoryItem; slug: string }) {
  return (
    <Link
      to="/console/$slug/staff/item/$itemId"
      params={{ slug, itemId: item.id }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#f7f7f7] transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-[#f7f7f7] flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
        <Package className="w-4 h-4 text-[#929292]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#222222] truncate">{item.postTitle}</p>
        <p className="text-xs text-[#929292] truncate">{item.subcategoryName} · {item.internalLocation}</p>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLE[item.status]}`}>
        {STATUS_LABEL[item.status]}
      </span>
    </Link>
  )
}

interface RecentItemsPanelProps {
  items: Array<DashboardInventoryItem>
  slug: string
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function RecentItemsPanel({ items, slug, totalCount, page, pageSize, onPageChange }: RecentItemsPanelProps) {
  const hasTotal = totalCount > 0
  const totalPages = hasTotal ? Math.max(1, Math.ceil(totalCount / pageSize)) : undefined
  const hasPrev = page > 1
  const hasNext = hasTotal ? page < (totalPages ?? 1) : items.length >= pageSize
  const start = (page - 1) * pageSize + 1
  const end = hasTotal ? Math.min(page * pageSize, totalCount) : page * pageSize

  return (
    <div className="bg-white rounded-2xl border border-[#dddddd] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#222222]">Recent Items I Logged</h2>
        <Link to="/console/$slug/staff/history" params={{ slug }} className="text-xs text-[#ff385c] font-medium hover:underline">
          View all
        </Link>
      </div>

      <div className="flex-1 space-y-0.5 min-h-0">
        {items.map(item => (
          <RecentItemRow key={item.id} item={item} slug={slug} />
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#f7f7f7]">
          <span className="text-[11px] text-[#929292]">
            {start}–{end}{hasTotal ? ` of ${totalCount}` : ''}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrev}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6a6a6a]" />
            </button>
            <span className="text-[11px] text-[#6a6a6a] min-w-[3rem] text-center">
              {page}{totalPages ? ` / ${totalPages}` : ''}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6a6a6a]" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
