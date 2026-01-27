import { SearchFilter } from './search-filter';
import { Filter } from './filter';
import type { FilterOption } from './filter';

interface TableFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    showAll?: boolean;
    allLabel?: string;
  }>;
  className?: string;
}

/**
 * Reusable Table Filters Bar Component
 * 
 * Provides a consistent search and filter bar for table views.
 * Supports multiple filter dropdowns alongside search input.
 * 
 * @param searchValue - Current search input value
 * @param onSearchChange - Handler for search input changes
 * @param searchPlaceholder - Placeholder text for search input
 * @param filters - Array of filter configurations
 * @param className - Additional CSS classes
 */
export function TableFiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  className = '',
}: TableFiltersBarProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <div className="flex items-center gap-4">
        <SearchFilter
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="flex-1"
        />
        {filters.map((filter, index) => (
          <Filter
            key={index}
            type="select"
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
            label={filter.label}
            showAll={filter.showAll ?? true}
            allLabel={filter.allLabel ?? 'All'}
            className="text-sm font-medium"
          />
        ))}
      </div>
    </div>
  );
}

