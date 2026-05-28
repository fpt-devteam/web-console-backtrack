import type { ReactNode } from 'react'
import { Cpu, Gauge, Layers, MapPin, Package, Printer, Ruler, ScanSearch, Tag } from 'lucide-react'
import { Button } from '@/components/common/core/button'
import { ClaimCardImage } from '@/components/common/claim/claim-card/claim-card-image'
import { CATEGORY_COLOR } from '@/components/common/claim/claim.constants'
import { formatDateTime } from '@/utils/datetime.util'
import { getSubcategoryIcon } from '@/utils/subcategory-icon'
import type { SupportFormData } from '@/types/chat.types'
import type { InventoryItem, ItemCategory } from '@/services/inventory.service'
import {
  getInventoryTitle,
  getInventoryColor,
  getInventoryBrand,
  getInventoryModel,
  getInventoryCondition,
  getInventoryMaterial,
  getInventorySize,
  getInventoryDistinctiveMarks,
  getInventoryDescription,
} from '@/utils/inventory-view'

interface ClaimComparisonViewProps {
  claim: SupportFormData
  item: InventoryItem
  subcategoryNameById?: Record<string, string>
  subcategoryCodeById?: Record<string, string>
  onPrintSlip?: () => void
}

const GRID_COLS = 'grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)]'

function Dash() {
  return <span className="text-mute">—</span>
}

function CategoryBadge({ category }: { category?: string | null }) {
  if (!category) return <Dash />
  const { bg, text } = CATEGORY_COLOR[category as ItemCategory]
  return <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${text}`}>{category}</span>
}

function ImagesStrip({ images, category, subcategoryIcon, alt }: {
  images?: string[] | null
  category?: string | null
  subcategoryIcon?: string | null
  alt: string
}) {
  const list = images && images.length > 0 ? images.slice(0, 3) : [null]
  return (
    <div className="flex gap-2 flex-wrap">
      {list.map((src, i) => (
        <ClaimCardImage key={i} src={src} alt={alt} category={category} subcategoryIcon={subcategoryIcon} />
      ))}
    </div>
  )
}

function ColumnHeader({ title, subtitle, tone }: { title: string; subtitle: string; tone: 'claim' | 'found' }) {
  const dot = tone === 'claim' ? 'bg-amber-400' : 'bg-green-500'
  return (
    <div className="pb-6 border-b border-hairline">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-ink">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        {title}
      </span>
      <p className="text-[11px] text-mute mt-0.5">{subtitle}</p>
    </div>
  )
}

function Row({ label, claim, found }: { label: string; claim: ReactNode; found: ReactNode }) {
  const cell = `py-4`
  return (
    <>
      <div className={`${cell} text-[10px] font-semibold tracking-widest text-mute uppercase`}>{label}</div>
      <div className={`${cell} text-sm text-ink min-w-0 break-words`}>{claim}</div>
      <div className={`${cell} text-sm text-ink min-w-0 break-words`}>{found}</div>
    </>
  )
}

export function ClaimComparisonView({ claim, item, subcategoryNameById, subcategoryCodeById, onPrintSlip }: ClaimComparisonViewProps) {
  const lostWhen = claim.eventTime ? formatDateTime(new Date(claim.eventTime).toISOString()) : null
  const foundWhen = formatDateTime(item.eventTime)
  const foundTitle = getInventoryTitle(item, subcategoryNameById)
  const foundLocation = item.organizationFoundLocation?.trim() || item.displayAddress?.trim() || null
  const foundDetails = getInventoryDistinctiveMarks(item) ?? getInventoryDescription(item)

  const claimSubcategoryCode = subcategoryCodeById?.[claim.subCategoryId]
  const claimSubcategoryIcon = claimSubcategoryCode
    ? getSubcategoryIcon(claim.category as ItemCategory, claimSubcategoryCode)
    : null

  const foundSubcategoryCode = subcategoryCodeById?.[item.subcategoryId]
  const foundSubcategoryIcon = foundSubcategoryCode
    ? getSubcategoryIcon(item.category, foundSubcategoryCode)
    : null

  const extras = [
    { label: 'Brand',            value: getInventoryBrand(item),                             icon: Tag     },
    { label: 'Model',            value: getInventoryModel(item),                             icon: Cpu     },
    { label: 'Condition',        value: getInventoryCondition(item),                         icon: Gauge   },
    { label: 'Material',         value: getInventoryMaterial(item),                          icon: Layers  },
    { label: 'Size',             value: getInventorySize(item),                              icon: Ruler   },
    { label: 'Storage location', value: item.organizationStorageLocation?.trim() || null,    icon: MapPin  },
  ].filter((e) => e.value)

  return (
    <div className="bg-white flex flex-col min-h-full">
      <div className="flex items-start justify-between gap-3 px-5 py-3.5">
        <div className="flex items-start gap-2.5">
          <ScanSearch className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-ink">Verify this claim</h3>
            <p className="text-xs text-mute mt-0.5">
              Compare what the customer reported with the matched item in your storage before returning it.
            </p>
          </div>
        </div>
        {onPrintSlip && (
          <Button variant="ghost" size="sm" onClick={onPrintSlip} className="text-mute shrink-0">
            <Printer className="w-3.5 h-3.5" />
            Print slip
          </Button>
        )}
      </div>

      <div className="flex-1 p-5 pt-0">
        <div className={`grid ${GRID_COLS} gap-x-5`}>
          <div className="pb-3 border-b border-hairline" />
          <ColumnHeader title="Customer's claim" subtitle="What was reported lost" tone="claim" />
          <ColumnHeader title="Found in storage" subtitle="Item you have on hand" tone="found" />

          <Row
            label="Photos"
            claim={<ImagesStrip images={claim.imageUrls} category={claim.category} subcategoryIcon={claimSubcategoryIcon} alt={claim.itemName} />}
            found={<ImagesStrip images={item.imageUrls} category={item.category} subcategoryIcon={foundSubcategoryIcon} alt={foundTitle} />}
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
          <Row
            label="Color"
            claim={claim.color || <Dash />}
            found={getInventoryColor(item) ?? <Dash />}
          />
          <Row
            label="Location"
            claim={claim.lostLocation || <Dash />}
            found={foundLocation ?? <Dash />}
          />
          <Row
            label="Date"
            claim={lostWhen ?? <Dash />}
            found={foundWhen || <Dash />}
          />
          <Row
            label="Details"
            claim={claim.additionalDetails || <Dash />}
            found={foundDetails ?? <Dash />}
          />
        </div>

        {extras.length > 0 && (
          <div className="mt-5 rounded-xl border border-hairline bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline">
              <Package className="w-3.5 h-3.5 text-mute shrink-0" />
              <span className="text-xs font-bold tracking-widest text-ink uppercase">Found item details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-hairline">
              {extras.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white px-4 py-3 flex items-start gap-2.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-mute mt-0.5 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">{label}</span>
                    <span className="text-sm text-ink break-words">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
