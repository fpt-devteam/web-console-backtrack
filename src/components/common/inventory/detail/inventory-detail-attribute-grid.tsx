import {
  Calendar,
  Fingerprint,
  Hash,
  IdCard,
  Layers3,
  Palette,
  Ruler,
  ScanSearch,
  Tag,
  User,
} from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import QRCode from 'react-qr-code'
import { useMemo, useRef } from 'react'
import {
  formatInventoryDateOnly,
  getInventoryAiDescription,
  getInventoryBrand,
  getInventoryColor,
  getInventoryCondition,
  getInventoryDescription,
  getInventoryDistinctiveMarks,
  getInventoryMaterial,
  getInventoryModel,
  getInventorySize,
} from '@/utils/inventory-view'

function formatOrDash(v: string | null | undefined) {
  return v?.trim() ? v.trim() : '—'
}

function formatBoolOrDash(v: boolean | null | undefined): string {
  if (v === true) return 'Yes'
  if (v === false) return 'No'
  return '—'
}


function InlineMetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex flex-col items-start gap-1 text-sm text-[#222222] sm:flex-row sm:items-center sm:gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-[#a8a8a8]" />
        <span className="font-medium text-[#a8a8a8]">{label}:</span>
      </div>
      <span className="min-w-0 pl-6 font-semibold break-words sm:pl-0">{formatOrDash(value)}</span>
    </div>
  )
}

function AttributeCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="mt-0.5 text-[#a8a8a8]">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">{label}</div>
        <div className="mt-0.5 text-sm text-[#222222] break-words">{formatOrDash(value)}</div>
      </div>
    </div>
  )
}

export function categoryLabel(c: string) {
  switch (c) {
    case 'PersonalBelongings':
      return 'Personal Belongings'
    case 'Cards':
      return 'Cards'
    case 'Electronics':
      return 'Electronics'
    case 'Others':
      return 'Others'
    default:
      return c
  }
}

export function InventoryDetailAttributeGrid({
  item,
}: {
  item: InventoryItem
  subcategoryNameById?: Record<string, string>
  orgSlug?: string | null
}) {
  const cat = item.category
  const aiDesc = getInventoryAiDescription(item)
  const brand = getInventoryBrand(item)
  const material = getInventoryMaterial(item)
  const size = getInventorySize(item)
  const color = getInventoryColor(item)
  const condition = getInventoryCondition(item)
  const model = getInventoryModel(item)
  const itemNameValue =
    cat === 'Others'
      ? item.otherDetail?.itemName
      : item.personalBelongingDetail?.itemName ??
        item.electronicDetail?.itemName ??
        item.cardDetail?.itemName ??
        null

  return (
    <div className="grid grid-cols-2 gap-y-6">
      <div className="col-span-2">
        <InlineMetaRow
          icon={ScanSearch}
          label={cat === 'Others' ? 'Item identifier' : 'Item name'} value={itemNameValue} />
      </div>

      {/* structured attributes */}
      <div className="col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          {cat !== 'Cards' ? <AttributeCard icon={Palette} label="Color" value={color} /> : null}

          {cat !== 'Cards' && (cat === 'PersonalBelongings' || brand) ? (
            <AttributeCard icon={Tag} label="Brand" value={brand} />
          ) : null}
          {cat !== 'Cards' && (cat === 'PersonalBelongings' || material) ? (
            <AttributeCard icon={Layers3} label="Material" value={material} />
          ) : null}

          {cat !== 'Cards' && (cat === 'PersonalBelongings' || condition) ? (
            <AttributeCard icon={Layers3} label="Condition" value={condition} />
          ) : null}
          {cat !== 'Cards' && (cat === 'PersonalBelongings' || size) ? (
            <AttributeCard icon={Ruler} label="Size" value={size} />
          ) : null}

          {cat === 'Electronics' && model ? <AttributeCard icon={Layers3} label="Model" value={model} /> : null}
          {cat === 'Electronics' ? (
            <AttributeCard icon={Layers3} label="Has case" value={formatBoolOrDash(item.electronicDetail?.hasCase)} />
          ) : null}
          {cat === 'Electronics' && item.electronicDetail?.caseDescription?.trim() ? (
            <AttributeCard icon={Layers3} label="Case description" value={item.electronicDetail.caseDescription} />
          ) : null}
          {cat === 'Electronics' && item.electronicDetail?.lockScreenDescription?.trim() ? (
            <AttributeCard icon={Layers3} label="Lock screen" value={item.electronicDetail.lockScreenDescription} />
          ) : null}
          {cat === 'Cards' ? (
            <AttributeCard icon={User} label="Holder name" value={item.cardDetail?.holderName} />
          ) : null}
          {cat === 'Cards' ? (
            <AttributeCard icon={Hash} label="Card number" value={item.cardDetail?.cardNumberMasked} />
          ) : null}
          {cat === 'Cards' ? (
            <AttributeCard icon={IdCard} label="Issuing authority" value={item.cardDetail?.issuingAuthority} />
          ) : null}
          {cat === 'Cards' ? (
            <>
              <InlineMetaRow icon={Calendar} label="Date of birth" value={formatInventoryDateOnly(item.cardDetail?.dateOfBirth ?? undefined)} />
              <InlineMetaRow icon={Calendar} label="Issue date" value={formatInventoryDateOnly(item.cardDetail?.issueDate ?? undefined)} />
              <InlineMetaRow icon={Calendar} label="Expiry date" value={formatInventoryDateOnly(item.cardDetail?.expiryDate ?? undefined)} />
            </>
          ) : null}
        </div>

      </div>
      {/* distinctive marks & additional details */}
      <div className="col-span-2 space-y-4">
        {getInventoryDistinctiveMarks(item) ? (
          <div>
            <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">Distinctive marks</div>
            <div className="mt-1 flex items-start gap-2 text-[#222222]">
              <Fingerprint className="w-4 h-4 text-[#a8a8a8] shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed wrap-break-word">{getInventoryDistinctiveMarks(item)}</span>
            </div>
          </div>
        ) : null}

        <div>
          <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">Additional details</div>
          <p className="mt-1 text-sm text-[#222222] leading-relaxed">{getInventoryDescription(item) ?? '—'}</p>
        </div>

        {aiDesc ? (
          <div>
            <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">AI description</div>
            <p className="mt-1 text-sm text-[#222222] leading-relaxed">{aiDesc}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ItemQrCard({ orgSlug, itemId }: { orgSlug: string; itemId: string }) {
  const itemUrl = useMemo(() => {
    return `https://backtrack-console.vercel.app/console/${orgSlug}/staff/inventory/${itemId}/`
  }, [orgSlug, itemId])

  const qrWrapRef = useRef<HTMLDivElement | null>(null)

  const downloadQrSvg = () => {
    const svg = qrWrapRef.current?.querySelector('svg')
    if (!svg) return

    const serializer = new XMLSerializer()
    const raw = serializer.serializeToString(svg)
    const withNs = raw.includes('xmlns=') ? raw : raw.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    const blob = new Blob([withNs], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `backtrack-item-${orgSlug}-${itemId}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex flex-col items-center gap-2 rounded-[12px] border border-[#dddddd] bg-white p-3">
        <div ref={qrWrapRef}>
          <QRCode value={itemUrl} size={60} />
        </div>
        <button
          type="button"
          className="text-xs font-medium text-[#ff385c] hover:text-[#e00b41]"
          onClick={downloadQrSvg}
        >
          Download QR
        </button>
      </div>
    </div>
  )
}
