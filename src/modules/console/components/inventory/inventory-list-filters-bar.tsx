import { Search, X } from 'lucide-react'
import { FilterDateRangeChip, FilterDropdownChip } from './filter-dropdown-chip'
import type { ChipOption } from './filter-dropdown-chip'
import type { ReactNode } from 'react'
import type { CategoryFilter, PostTypeFilter, StatusFilter } from './use-inventory-list-state'

export type InventoryAuthorOption = ChipOption

const POST_TYPE_OPTIONS: Array<ChipOption> = [
  { value: 'All', label: 'All types' },
  { value: 'Found', label: 'Found' },
  { value: 'Lost', label: 'Lost' },
]

const CATEGORY_OPTIONS: Array<ChipOption> = [
  { value: 'All', label: 'All categories' },
  { value: 'PersonalBelongings', label: 'Personal belongings' },
  { value: 'Cards', label: 'Cards' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Others', label: 'Others' },
]

const STATUS_OPTIONS: Array<ChipOption> = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'InStorage', label: 'In Storage' },
  { value: 'ReturnScheduled', label: 'Return Scheduled' },
  { value: 'Returned', label: 'Returned' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Expired', label: 'Expired' },
]

export function InventoryListFiltersBar({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusChange,
  postTypeFilter,
  onPostTypeChange,
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
  postTypeFilter?: PostTypeFilter
  onPostTypeChange?: (v: PostTypeFilter) => void
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
  authorOptions?: Array<InventoryAuthorOption>
  showClear: boolean
  onClear: () => void
  rightSlot?: ReactNode
}) {
  // ── oneRow — pill chip layout ──────────────────────────────────────────────
  if (layout === 'oneRow') {
    const authorChipOptions: Array<ChipOption> = [
      { value: '', label: 'All staff' },
      ...(authorOptions ?? []),
    ]

    const DateRangeChip = (
      <FilterDateRangeChip
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    )

    const CategoryChip = (
      <FilterDropdownChip
        label="Category"
        value={categoryFilter}
        defaultValue="All"
        options={CATEGORY_OPTIONS}
        onChange={(v) => onCategoryChange(v as CategoryFilter)}
      />
    )

    return (
      <div className="flex items-center gap-2 flex-nowrap text-sm">
        {/* Search — flex-1 so it fills remaining space */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search by name, details..."
            className="w-full h-10 bg-white pl-10 pr-2 border border-hairline rounded-lg focus:outline-none focus:border-ink text-ink placeholder:text-silver transition-colors hover:border-silver"
          />
        </div>

        {/* Date range + category chips */}
        {categoryFirst ? CategoryChip : DateRangeChip}
        {categoryFirst ? DateRangeChip : CategoryChip}

        {/* Post type chip */}
        {onPostTypeChange && (
          <FilterDropdownChip
            label="Type"
            value={postTypeFilter ?? 'All'}
            defaultValue="All"
            options={POST_TYPE_OPTIONS}
            onChange={(v) => onPostTypeChange(v as PostTypeFilter)}
          />
        )}

        {/* Author chip */}
        {showAuthorFilter && (
          <FilterDropdownChip
            label="Author"
            value={authorValue ?? ''}
            defaultValue=""
            options={authorChipOptions}
            onChange={(v) => onAuthorChange?.(v)}
          />
        )}

        {/* Clear */}
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-sm text-mute hover:text-danger hover:bg-[#fff0f0] border border-transparent hover:border-[#fdd] transition-all font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        {rightSlot}
      </div>
    )
  }

  // ── twoRows — classic layout ───────────────────────────────────────────────
  const categoryWidth = showAuthorFilter ? 'md:w-1/4' : 'md:w-1/2'

  return (
    <div className="text-sm space-y-3">
      {/* Row 1: search + clear */}
      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search by name/details..."
            className="w-full bg-white pl-10 pr-4 py-2 border border-hairline rounded-lg focus:outline-none focus:border-ink text-ink transition-colors hover:border-silver"
          />
        </div>
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-sm text-mute hover:text-danger font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Row 2: date range + status + category + author */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
        {/* Date range */}
        <div className="w-full md:w-1/2 flex items-center gap-2">
          <input
            type="date"
            lang="vi-VN"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            max={toDate || undefined}
            className="w-full rounded-lg border border-hairline bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
          <span className="text-mute text-xs shrink-0">to</span>
          <input
            type="date"
            lang="vi-VN"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            min={fromDate || undefined}
            className="w-full rounded-lg border border-hairline bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        {/* Status filter */}
        {showStatusFilter && (
          <div className={`w-full ${categoryWidth} flex items-center gap-2`}>
            <span className="text-sm text-ink font-medium whitespace-nowrap">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              className="w-full pl-3 pr-6 py-1.5 border border-hairline rounded-lg focus:outline-none focus:border-ink bg-white text-sm text-ink transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        <div className={`w-full ${categoryWidth} flex items-center gap-2`}>
          <span className="text-sm text-ink font-medium whitespace-nowrap">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
            className="w-full pl-3 pr-6 py-1.5 border border-hairline rounded-lg focus:outline-none focus:border-ink bg-white text-sm text-ink transition-colors"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Author */}
        {showAuthorFilter && (
          <div className="w-full md:w-1/4 flex items-center gap-2">
            <span className="text-sm text-ink font-medium whitespace-nowrap">Author</span>
            <select
              value={authorValue ?? ''}
              onChange={(e) => onAuthorChange?.(e.target.value)}
              className="w-full pl-3 pr-6 py-1.5 border border-hairline rounded-lg focus:outline-none focus:border-ink text-sm text-ink bg-white transition-colors"
            >
              <option value="">All staff</option>
              {(authorOptions ?? []).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        {rightSlot}
      </div>
    </div>
  )
}
