/**
 * HH:MM time from an ISO string. Returns '' for null/undefined.
 */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * "Mon DD, YYYY" from an ISO string or Date.
 */
export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * "May 24 · 14:30" — compact date + time for card metadata.
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}

/**
 * Full label e.g. "Monday, 24 May 2026" — used on dashboard headers.
 */
export function formatFullDate(value: string | Date = new Date()): string {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
