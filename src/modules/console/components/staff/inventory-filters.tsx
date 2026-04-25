import { Calendar, X } from 'lucide-react'
import { SearchFilter, Filter } from '@/components/filters'
import { locations, categories, statuses } from '@/mock/data/mock-inventory'

interface ActiveFilter {
  label: string
  value: string
}

interface InventoryFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedLocation: string
  onLocationChange: (value: string) => void
  onSearch?: () => void
  searchPlaceholder?: string
}

export function InventoryFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  onSearch,
  searchPlaceholder = 'Search by ID or name...',
}: InventoryFiltersProps) {
  const activeFilters: ActiveFilter[] = []
  if (selectedStatus !== 'All') {
    activeFilters.push({ label: `Status: ${selectedStatus}`, value: 'status' })
  }
  if (selectedCategory !== 'All') {
    activeFilters.push({ label: `Category: ${selectedCategory}`, value: 'category' })
  }
  if (selectedLocation !== 'All') {
    activeFilters.push({ label: `Location: ${selectedLocation}`, value: 'location' })
  }

  const handleRemoveFilter = (value: string) => {
    if (value === 'status') onStatusChange('All')
    if (value === 'category') onCategoryChange('All')
    if (value === 'location') onLocationChange('All')
  }

  const handleClearAll = () => {
    onSearchChange('')
    onStatusChange('All')
    onCategoryChange('All')
    onLocationChange('All')
  }

  return (
    <div className="my-6">
      {/* Mobile & Tablet: Filters Row (3 filters) */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 lg:hidden mb-3">
        <Filter
          type="select"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses.filter((s) => s !== 'All').map((s) => ({ value: s, label: s }))}
          label="Status"
          className="w-full text-sm"
        />
        <Filter
          type="select"
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
          label="Category"
          className="w-full text-sm"
        />
        <Filter
          type="select"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations.filter((l) => l !== 'All').map((l) => ({ value: l, label: l }))}
          label="Location"
          className="w-full text-sm"
        />
      </div>

      {/* Mobile & Tablet: Search and Calendar Row */}
      <div className="flex flex-row items-center lg:hidden gap-3 mb-4">
        <div className="flex-1">
          <SearchFilter
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </div>
        <button className="p-2 border border-[#dddddd] rounded-[8px] hover:bg-[#f7f7f7] flex-shrink-0 active:scale-[0.92]">
          <Calendar className="w-5 h-5 text-[#6a6a6a]" />
        </button>
      </div>

      {/* Desktop: All in one row */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-4 mb-4">
        <div className="flex-1">
          <SearchFilter
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </div>
        <Filter
          type="select"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses.filter((s) => s !== 'All').map((s) => ({ value: s, label: s }))}
          label="Status"
          className="text-sm"
        />
        <Filter
          type="select"
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }))}
          label="Category"
          className="text-sm"
        />
        <Filter
          type="select"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations.filter((l) => l !== 'All').map((l) => ({ value: l, label: l }))}
          label="Location"
          className="text-sm"
        />
        <button className="p-2 border border-[#dddddd] rounded-[8px] hover:bg-[#f7f7f7] flex-shrink-0 active:scale-[0.92]">
          <Calendar className="w-5 h-5 text-[#6a6a6a]" />
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#6a6a6a]">ACTIVE:</span>
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-[#fff0f2] text-[#ff385c] rounded-full text-xs sm:text-sm"
            >
              <span className="truncate max-w-[150px] sm:max-w-none">{filter.label}</span>
              <button
                onClick={() => handleRemoveFilter(filter.value)}
                className="hover:text-[#c13515] flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs sm:text-sm text-[#ff385c] hover:text-[#c13515] font-medium whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
