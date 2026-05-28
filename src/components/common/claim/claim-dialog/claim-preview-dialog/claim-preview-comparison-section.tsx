import type { ReactNode } from 'react'
import { ScanSearch } from 'lucide-react'
import { ClaimCardImage } from '@/components/common/claim/claim-card/claim-card-image'
import { CATEGORY_COLOR } from '@/components/common/claim/claim-card/claim-card.constants'
import { formatDateTime } from '@/utils/datetime.util'
import type { SupportFormData } from '@/types/chat.types'
import type { InventoryItem, ItemCategory } from '@/services/inventory.service'
import { getInventoryTitle, getInventoryColor } from '@/utils/inventory-view'

interface ClaimPreviewComparisonSectionProps {
  claim: SupportFormData
  item: InventoryItem
  subcategoryNameById?: Record<string, string>
}

function Dash() {
  return <span className="text-mute">—</span>
}

function CategoryBadge({ category }: { category?: string | null }) {
  if (!category) return <Dash />
  const { bg, text } = CATEGORY_COLOR[category as ItemCategory]
  return <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${text}`}>{category}</span>
}

function ColHeader({ title, tone }: { title: string; tone: 'claim' | 'found' }) {
  const dot = tone === 'claim' ? 'bg-amber-400' : 'bg-green-500'
  return (
    <div className="pb-2 border-b border-hairline">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-ink">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        {title}
      </span>
    </div>
  )
}

/** One comparison row → three grid cells (label, claim value, found value). */
function Row({ label, claim, found, last }: { label: string; claim: ReactNode; found: ReactNode; last?: boolean }) {
  const cell = `py-2.5 ${last ? '' : 'border-b border-hairline'}`
  return (
    <>
      <div className={`${cell} text-[10px] font-semibold tracking-widest text-mute uppercase`}>{label}</div>
      <div className={`${cell} text-sm text-ink min-w-0 break-words`}>{claim}</div>
      <div className={`${cell} text-sm text-ink min-w-0 break-words`}>{found}</div>
    </>
  )
}

export function ClaimPreviewComparisonSection({ claim, item, subcategoryNameById }: ClaimPreviewComparisonSectionProps) {
  const lostWhen = claim.eventTime ? formatDateTime(new Date(claim.eventTime).toISOString()) : null
  const foundWhen = formatDateTime(item.eventTime)
  const foundTitle = getInventoryTitle(item, subcategoryNameById)
  const foundLocation = item.organizationFoundLocation?.trim() || item.displayAddress?.trim() || null

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-1.5 mb-3">
        <ScanSearch className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">Claim vs found item</span>
      </div>

      <div className="grid grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-4">
        <div className="pb-2 border-b border-hairline" />
        <ColHeader title="Reported" tone="claim" />
        <ColHeader title="In storage" tone="found" />

        <Row
          label="Photo"
          claim={<ClaimCardImage src={claim.imageUrls?.[0] ?? null} alt={claim.itemName} category={claim.category} />}
          found={<ClaimCardImage src={item.imageUrls[0] ?? null} alt={foundTitle} category={item.category} />}
        />
        <Row
          label="Item"
          claim={<span className="font-medium">{claim.itemName || <Dash />}</span>}
          found={<span className="font-medium">{foundTitle || <Dash />}</span>}
        />
        <Row
          label="Category"
          claim={<CategoryBadge category={claim.category} />}
          found={<CategoryBadge category={item.category} />}
        />
        <Row label="Color" claim={claim.color || <Dash />} found={getInventoryColor(item) ?? <Dash />} />
        <Row label="Location" claim={claim.lostLocation || <Dash />} found={foundLocation ?? <Dash />} />
        <Row label="Date" claim={lostWhen ?? <Dash />} found={foundWhen || <Dash />} last />
      </div>
    </div>
  )
}
