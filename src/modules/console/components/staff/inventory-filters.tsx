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
  // Calculate active filters dynamically
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

  // Handle remove filter
  const handleRemoveFilter = (value: string) => {
    if (value === 'status') onStatusChange('All')
    if (value === 'category') onCategoryChange('All')
    if (value === 'location') onLocationChange('All')
  }

  // Handle clear all
  const handleClearAll = () => {
    onSearchChange('')
    onStatusChange('All')
    onCategoryChange('All')
    onLocationChange('All')
  }
  return (
    <div className="my-6">
      {/* Mobile & Tablet Layout: 3 Filters on top, Search + Calendar on bottom */}
      {/* Desktop Layout: All in one row */}
      
      {/* Mobile & Tablet: Filters Row (3 filters) */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 lg:hidden mb-3">
        {/* Status Filter */}
        <Filter
          type="select"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses
            .filter((s) => s !== 'All')
            .map((s) => ({ value: s, label: s }))}
          label="Status"
          className="w-full text-sm"
        />

        {/* Category Filter */}
        <Filter
          type="select"
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories
            .filter((c) => c !== 'All')
            .map((c) => ({ value: c, label: c }))}
          label="Category"
          className="w-full text-sm"
        />

        {/* Location Filter */}
        <Filter
          type="select"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations
            .filter((l) => l !== 'All')
            .map((l) => ({ value: l, label: l }))}
          label="Location"
          className="w-full text-sm"
        />
      </div>

      {/* Mobile & Tablet: Search and Calendar Row */}
      <div className="flex flex-row items-center lg:hidden gap-3 mb-4">
        {/* Search */}
        <div className="flex-1">
          <SearchFilter
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Calendar Button */}
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0">
          <Calendar className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Desktop: All in one row */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-4 mb-4">
        {/* Search */}
        <div className="flex-1">
          <SearchFilter
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Status Filter */}
        <Filter
          type="select"
          value={selectedStatus}
          onChange={onStatusChange}
          options={statuses
            .filter((s) => s !== 'All')
            .map((s) => ({ value: s, label: s }))}
          label="Status"
          className="text-sm"
        />

        {/* Category Filter */}
        <Filter
          type="select"
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories
            .filter((c) => c !== 'All')
            .map((c) => ({ value: c, label: c }))}
          label="Category"
          className="text-sm"
        />

        {/* Location Filter */}
        <Filter
          type="select"
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations
            .filter((l) => l !== 'All')
            .map((l) => ({ value: l, label: l }))}
          label="Location"
          className="text-sm"
        />

        {/* Calendar Button */}
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0">
          <Calendar className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-gray-700">ACTIVE:</span>
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm"
            >
              <span className="truncate max-w-[150px] sm:max-w-none">{filter.label}</span>
              <button
                onClick={() => handleRemoveFilter(filter.value)}
                className="hover:text-blue-900 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

