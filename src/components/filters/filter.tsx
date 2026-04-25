export type FilterType = 'select' | 'checkbox' | 'button-group'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  type: FilterType
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  label?: string
  placeholder?: string
  showAll?: boolean
  allLabel?: string
  className?: string
}

export function Filter({
  type = 'select',
  value,
  onChange,
  options,
  label = '',
  showAll = true,
  allLabel = 'All',
  className = '',
}: FilterConfig) {
  // Select dropdown filter
  if (type === 'select') {
    const displayOptions = showAll
      ? [{ value: 'All', label: allLabel }, ...options]
      : options

    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-4 py-1.5 border border-[#dddddd] rounded-[8px] text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] ${className}`}
      >
        {displayOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {label ? `${label}: ${option.label}` : option.label}
          </option>
        ))}
      </select>
    )
  }

  // Checkbox filter (for future use)
  if (type === 'checkbox') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <span className="text-sm font-medium text-[#222222]">{label}</span>}
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 accent-[#ff385c] rounded border-[#dddddd]"
            />
            <span className="text-sm text-[#222222]">{option.label}</span>
          </label>
        ))}
      </div>
    )
  }

  // Button group filter (for future use)
  if (type === 'button-group') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {label && <span className="text-sm font-medium text-[#222222]">{label}:</span>}
        <div className="flex gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-4 py-1.5 rounded-[20px] text-sm font-medium transition-all active:scale-[0.92] ${
                value === option.value
                  ? 'bg-[#222222] text-white'
                  : 'bg-[#f7f7f7] text-[#6a6a6a] hover:bg-[#ebebeb]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
