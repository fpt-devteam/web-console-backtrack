import { useEffect, useState } from 'react'
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce'

interface ClaimSearchBarProps {
  searchTextPlaceholder?: string
  value: string
  onChange: (value: string) => void
}

export function ClaimSearchBar({
  searchTextPlaceholder = 'Search claims, customers, items...',
  value,
  onChange,
}: ClaimSearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const debouncedValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <input
      type="text"
      placeholder={searchTextPlaceholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="min-w-lg pl-4 py-2 bg-gray-200 rounded-full text-base text-ink placeholder-mute focus:outline-none"
    />
  )
}
