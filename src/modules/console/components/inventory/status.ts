export type InventoryStatus =
  | 'Active'
  | 'InStorage'
  | 'ReturnScheduled'
  | 'Returned'
  | 'Archived'
  | 'Expired'
  | (string & {})

export function inventoryStatusBadgeClass(s: InventoryStatus) {
  switch (s) {
    case 'InStorage':
      return 'bg-indigo-500 text-white'
    case 'Active':
      return 'bg-blue-600 text-white'
    case 'ReturnScheduled':
      return 'bg-amber-500 text-white'
    case 'Returned':
      return 'bg-green-500 text-white'
    case 'Archived':
      return 'bg-slate-600 text-white'
    case 'Expired':
      return 'bg-gray-600 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}

export function inventoryStatusLabel(s: InventoryStatus) {
  switch (s) {
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

export function inventoryStatusPillClass(s: InventoryStatus) {
  switch (s) {
    case 'Active':
      return 'bg-blue-600 text-white'
    case 'InStorage':
      return 'bg-indigo-500 text-white'
    case 'ReturnScheduled':
      return 'bg-amber-500 text-white'
    case 'Returned':
      return 'bg-green-500 text-white'
    case 'Archived':
      return 'bg-slate-600 text-white'
    case 'Expired':
      return 'bg-gray-600 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

