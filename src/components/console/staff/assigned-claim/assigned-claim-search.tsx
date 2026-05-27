import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce'

interface AssignedClaimSearchProps {
  onChange: (value: string) => void
  placeholder?: string
}

export function AssignedClaimSearch({
  onChange,
  placeholder = 'Search by claim, customer, or item...',
}: AssignedClaimSearchProps) {
  const [value, setValue] = useState('')
  const debounced = useDebouncedValue(value, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    onChange(debounced)
  }, [debounced])

  return (
    <div className="relative w-full sm:max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0b0]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 bg-white pl-10 pr-10 border border-[#dddddd] rounded-full focus:outline-none focus:border-[#222222] text-[#222222] placeholder:text-[#b0b0b0] transition-colors hover:border-[#b0b0b0]"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b0b0] hover:text-[#222222] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
