import type { InventoryItem } from '@/services/inventory.service'
import { ClaimAssignee } from '@/components/common/claim/claim-assignee'
import { DetailRow, SectionTitle } from './inventory-detail-primitives'
import { formatDateTimeOrDash } from './inventory-detail-format'

export function InventoryLoggedByCard({ item }: { item: InventoryItem }) {
  return (
    <div>
      <SectionTitle title="Logged by" />
      <div className="mt-2 rounded-xl px-4 py-2 bg-gray-50">
        <div className="grid grid-cols-[2fr_8fr] items-center gap-3 py-1">
          <dt className="text-xs font-medium text-gray-500">Staff</dt>
          <dd className="flex justify-end">
            <ClaimAssignee name={item.author?.displayName} avatarUrl={item.author?.avatarUrl} className='text-gray-800' />
          </dd>
        </div>
        <DetailRow label="Logged at" value={formatDateTimeOrDash(item.createdAt)} />
      </div>
    </div>
  )
}
