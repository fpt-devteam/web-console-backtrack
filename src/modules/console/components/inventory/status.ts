export type InventoryStatus =
  | 'All'
  | 'InStorage'
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
    case 'InStorage':
      return 'bg-[#fff0f2] text-[#ff385c]'
    case 'Returned':
      return 'bg-[#e8f9f0] text-[#06c167]'
    case 'Archived':
      return 'bg-[#f7f7f7] text-[#6a6a6a]'
    case 'Expired':
      return 'bg-[#fff8e6] text-[#c97a00]'
    default:
      return 'bg-[#f7f7f7] text-[#6a6a6a]'
  }
}

export function inventoryStatusLabel(s: InventoryStatus) {
  switch (s) {
    case 'All':
      return 'All'
    case 'InStorage':
      return 'In Storage'
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
