import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { InventoryItem } from '@/services/inventory.service'
import { inventoryStatusLabel, inventoryStatusPillClass } from './inventory-status'

function formatInventoryId(id: string): string {
  return `INV-${id.slice(0, 8).toUpperCase()}`
}

interface InventoryDetailHeaderProps {
  backTo: { to: string; params: Record<string, string> }
  itemId: string
  itemName: string
  status: InventoryItem['status']
  actions?: ReactNode
}

export function InventoryDetailHeader({
  backTo,
  itemId,
  itemName,
  status,
  actions,
}: InventoryDetailHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="px-2 py-2 flex gap-4 items-center justify-between border-b border-gray-100 bg-white">
        {/* Breadcrumb bar */}
        <div className="flex items-center gap-3 text-md text-ink font-semibold">
            <Link
            to={backTo.to}
            params={backTo.params}
            className="flex shrink-0 items-center gap-1 text-mute transition-colors hover:cursor-pointer hover:text-ink"
            >
            <ChevronLeft />
            Back to inventory
            </Link>

            <span className="">|</span>

            <div className="flex min-w-0 items-center gap-1">
            <span className="font-mono mt-1">{formatInventoryId(itemId)}</span>
            <span>/</span>
            <span className="min-w-0 truncate">{itemName}</span>
            </div>

            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-semibold ${inventoryStatusPillClass(status)}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {inventoryStatusLabel(status)}
            </span>
        </div>
        {actions && (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end [&>button]:min-h-10 [&>button]:flex-1 sm:[&>button]:min-h-9 sm:[&>button]:flex-none">
            {actions}
          </div>
        )}
      </div>
    </>
  )
}
