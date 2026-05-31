export function formatOrDash(v: string | null | undefined) {
  return v?.trim() ? v.trim() : '—'
}

export function formatDateTimeOrDash(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}
