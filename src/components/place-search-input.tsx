import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { nominatimService, type NominatimPlace } from '@/services/nominatim.service'

/** Place selected from Nominatim – sent to BE (lat/lon + display_name, optional place_id). */
export interface PlaceSearchResult {
  latitude: number
  longitude: number
  displayAddress: string
  /** place_id from Nominatim – sent to BE as externalPlaceId when present. */
  placeId?: string
}

const DEBOUNCE_MS = 400

export interface PlaceSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (place: PlaceSearchResult) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
}

export function PlaceSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search address or place (OpenStreetMap)',
  id,
  disabled,
  className = '',
}: PlaceSearchInputProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimPlace[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setIsSearching(true)
    try {
      const list = await nominatimService.search(q, 5)
      setResults(list)
      setSelectedIndex(-1)
      setIsOpen(true)
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => runSearch(query), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, runSearch])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (place: NominatimPlace) => {
    onChange(place.display_name)
    onSelect?.({
      latitude: place.lat,
      longitude: place.lon,
      displayAddress: place.display_name,
      placeId: place.place_id != null ? String(place.place_id) : undefined,
    })
    setQuery(place.display_name)
    setResults([])
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i > 0 ? i - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          id={id}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onChange(e.target.value)
          }}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="pl-10 pr-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin pointer-events-none" />
        )}
      </div>
      {isOpen && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {results.map((place, index) => (
            <li
              key={place.place_id}
              role="option"
              aria-selected={index === selectedIndex}
              className={`px-3 py-2 text-sm cursor-pointer truncate ${
                index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500 mt-1">Powered by OpenStreetMap Nominatim. Select a result to get coordinates.</p>
    </div>
  )
}
