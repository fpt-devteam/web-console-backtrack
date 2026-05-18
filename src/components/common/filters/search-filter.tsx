import { Search, X } from 'lucide-react'

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  onSearch?: () => void
  onClear?: () => void
  placeholder?: string
  className?: string
  showClearButton?: boolean
}

export function SearchFilter({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search by ID or name...',
  className = '',
  showClearButton = false,
}: SearchFilterProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && value.trim()) {
      onSearch()
    }
  }

  const handleClear = () => {
    onChange('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={`flex-1 relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#929292]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-1 border border-[#dddddd] rounded-[8px] text-[#222222] placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c]"
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#f7f7f7] rounded-full transition-colors"
        >
          <X className="w-3 h-3 text-[#929292]" />
        </button>
      )}
    </div>
  )
}
