import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import type { CategoryFilter, StatusFilter } from './use-inventory-list-state'

export type InventoryAuthorOption = {
  value: string
  label: string
}

export function InventoryListFiltersBar({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  layout = 'twoRows',
  categoryFirst = false,
  showStatusFilter = true,
  showAuthorFilter,
  authorValue,
  onAuthorChange,
  authorOptions,
  showClear,
  onClear,
  rightSlot,
}: {
  searchTerm: string
  onSearchTermChange: (v: string) => void
  statusFilter: StatusFilter
  onStatusChange: (v: StatusFilter) => void
  categoryFilter: CategoryFilter
  onCategoryChange: (v: CategoryFilter) => void
  fromDate: string
  onFromDateChange: (v: string) => void
  toDate: string
  onToDateChange: (v: string) => void
  layout?: 'twoRows' | 'oneRow'
  categoryFirst?: boolean
  showStatusFilter?: boolean
  showAuthorFilter?: boolean
  authorValue?: string
  onAuthorChange?: (v: string) => void
  authorOptions?: InventoryAuthorOption[]
  showClear: boolean
  onClear: () => void
  rightSlot?: ReactNode
}) {
  const categoryWidth = showAuthorFilter ? 'md:w-1/4' : 'md:w-1/2'

  const DateRange = (
    <div
      className={
        layout === 'oneRow'
          ? 'flex items-center gap-2 shrink-0'
          : 'w-full md:w-1/2 flex items-center gap-2'
      }
    >
      <input
        type="date"
        lang="vi-VN"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        max={toDate || undefined}
        className={
          layout === 'oneRow'
            ? 'w-[140px] rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
            : 'w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
        }
      />
      <span className="text-gray-400 px-1">to</span>
      <input
        type="date"
        lang="vi-VN"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        min={fromDate || undefined}
        className={
          layout === 'oneRow'
            ? 'w-[140px] rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
            : 'w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
        }
      />
    </div>
  )

  const Category = (
    <div
      className={
        layout === 'oneRow'
          ? 'flex items-center gap-2 shrink-0'
          : `w-full ${categoryWidth} flex items-center gap-2`
      }
    >
      <span className="text-black font-medium whitespace-nowrap">Category</span>
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
        className={
          layout === 'oneRow'
            ? 'w-[160px] pl-2 pr-6 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 text-ellipsis'
            : 'w-full pl-2 pr-6 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 text-ellipsis'
        }
      >
        <option value="All">All</option>
        <option value="PersonalBelongings">Personal belongings</option>
        <option value="Cards">Cards</option>
        <option value="Electronics">Electronics</option>
        <option value="Others">Others</option>
      </select>
    </div>
  )

  const Author = showAuthorFilter ? (
    <div
      className={
        layout === 'oneRow'
          ? 'flex items-center gap-2 shrink-0'
          : 'w-full md:w-1/4 flex items-center gap-2'
      }
    >
      <span className="text-black font-medium whitespace-nowrap">Author</span>
      <select
        value={authorValue ?? ''}
        onChange={(e) => onAuthorChange?.(e.target.value)}
        className={
          layout === 'oneRow'
            ? 'w-[180px] pl-2 pr-6 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-ellipsis'
            : 'w-full pl-2 pr-6 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white text-ellipsis'
        }
      >
        <option value="">All</option>
        {(authorOptions ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  ) : null

  return (
    <div className=" text-sm">
      {layout === 'oneRow' ? (
        <div className="flex items-center gap-5 flex-nowrap">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Search by name/details..."
              className="w-full bg-white pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {categoryFirst ? Category : DateRange}
          {categoryFirst ? DateRange : Category}
          {Author}

          {showClear ? (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-red-600 font-medium transition-all hover:scale-[1.03] hover:drop-shadow-sm"
            >
              Clear
            </button>
          ) : null}

          {rightSlot}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Search by name/details..."
              className="w-full bg-white pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {showClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-red-600 font-medium transition-all hover:scale-[1.03] hover:drop-shadow-sm"
            >
              Clear
            </button>
          ) : null}
        </div>
      )}

      <div
        className={
          layout === 'oneRow'
            ? 'hidden'
            : 'mt-2 flex flex-col md:flex-row md:items-center gap-4 md:gap-6'
        }
      >
        {DateRange}

        {showStatusFilter ? (
          <div className={`w-full ${categoryWidth} flex items-center gap-2`}>
            <span className="text-black font-medium whitespace-nowrap">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              className="w-full pl-2 pr-6 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 text-ellipsis"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="InStorage">In Storage</option>
              <option value="ReturnScheduled">Return Sched</option>
              <option value="Returned">Returned</option>
              <option value="Archived">Archived</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        ) : null}

        {Category}
        {Author}

        {rightSlot}
      </div>
    </div>
  )
}

