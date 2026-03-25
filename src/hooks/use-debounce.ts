import { useState, useEffect } from 'react'

/** Default delay for search debounce (ms). Change here to apply everywhere. */
export const SEARCH_DEBOUNCE_MS = 500

/**
 * Returns a debounced value that updates only after `delayMs` has passed
 * since the last change to `value`. Use for search inputs to avoid
 * triggering API or filter on every keystroke.
 *
 * @param value - The value to debounce (e.g. search input state)
 * @param delayMs - Delay in milliseconds (e.g. SEARCH_DEBOUNCE_MS)
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debouncedValue
}
