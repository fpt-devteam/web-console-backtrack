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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      )}
    </div>
  )
}

