export type InventoryStatus =
  | 'All'
  | 'InStorage'
  | 'Returned'
  | 'Archived'
  | 'Expired'
  | (string & {})

export function inventoryStatusBadgeClass(s: InventoryStatus) {
  switch (s) {
    case 'InStorage':
      return 'bg-indigo-500 text-white'
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

export function inventoryStatusPillClass(s: InventoryStatus) {
  switch (s) {
    case 'InStorage':
      return 'bg-indigo-500 text-white'
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

