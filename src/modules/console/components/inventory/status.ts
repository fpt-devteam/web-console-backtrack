export type InventoryStatus =
  | 'All'
  | 'Active'
  | 'InStorage'
  | 'ReturnScheduled'
  | 'Returned'
  | 'Archived'
  | 'Expired'
  | (string & {})

/**
 * Airbnb design-token status badge classes.
 *
 * InStorage  → Rausch (brand primary) — item is actively held
 * Returned   → Success green         — item has been returned / resolved
 * Archived   → Muted gray            — item is inactive / archived
 * Expired    → Amber                 — item has lapsed / expired
 */
export function inventoryStatusBadgeClass(s: InventoryStatus) {
  switch (s) {
    case 'Active':
      return 'border-[#ff385c] bg-[#fff0f3] text-[#ff385c]'
    case 'InStorage':
      return 'border-[#ff385c] bg-[#fff0f3] text-[#ff385c]'
    case 'ReturnScheduled':
      return 'border-[#ff8c00] bg-[#fff3e0] text-[#ff8c00]'
    case 'Returned':
      return 'border-[#a8d5a3] bg-[#e6f4ea] text-[#008a05]'
    case 'Archived':
      return 'border-[#dddddd] bg-[#f0f0f0] text-[#636363]'
    case 'Expired':
      return 'border-[#c62828] bg-[#fdecea] text-[#c62828]'
    default:
      return 'border-[#dddddd] bg-[#f0f0f0] text-[#636363]'
  }
}

export function inventoryStatusLabel(s: InventoryStatus) {
  switch (s) {
    case 'All':
      return 'All'
    case 'Active':
      return 'Active'
    case 'InStorage':
      return 'In Storage'
    case 'ReturnScheduled':
      return 'Return Scheduled'
    case 'Returned':
      return 'Returned'
    case 'Archived':
      return 'Archived'
    case 'Expired':
      return 'Expired'
    default:
      return s
  }
}

/** Alias kept for callers that use inventoryStatusPillClass — same token mapping. */
export function inventoryStatusPillClass(s: InventoryStatus) {
  return inventoryStatusBadgeClass(s)
}
