import {
  Calendar,
  Fingerprint,
  Hash,
  IdCard,
  Layers3,
  MapPin,
  Palette,
  Ruler,
  ScanSearch,
  Tag,
  User,
} from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import { format } from 'date-fns'
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
  getInventorySubcategoryName,
} from '@/utils/inventory-view'

function formatOrDash(v: string | null | undefined) {
  return v?.trim() ? v.trim() : '—'
}

function formatFoundTime24h(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return format(d, 'dd/MM/yyyy HH:mm')
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
    <div className="flex items-center gap-2 text-sm text-[#222222]">
      <Icon className="w-4 h-4 text-[#a8a8a8]" />
      <span className="text-[#a8a8a8] font-medium">{label}:</span>
      <span className="font-semibold">{formatOrDash(value)}</span>
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
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 text-[#a8a8a8]">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">{label}</div>
        <div className="mt-1 text-sm text-[#222222] break-words">{formatOrDash(value)}</div>
      </div>
    </div>
  )
}

function categoryLabel(c: string) {
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
  subcategoryNameById,
  orgSlug,
}: {
  item: InventoryItem
  subcategoryNameById?: Record<string, string>
  orgSlug?: string | null
}) {
  const subName = getInventorySubcategoryName(item, subcategoryNameById)
  const cat = item.category
  const aiDesc = getInventoryAiDescription(item)
  const itemNameValue =
    cat === 'Others'
      ? item.otherDetail?.itemName
      : item.personalBelongingDetail?.itemName ??
        item.electronicDetail?.itemName ??
        item.cardDetail?.itemName ??
        null

  return (
    <>
      <div className="space-y-4">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
            <div className="flex items-start min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff0f2] text-[#ff385c]">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span className="break-words text-left">
                  {`${categoryLabel(item.category)}${subName.trim() ? ` - ${subName.trim()}` : ''}`}
                </span>
              </span>
            </div>
            <InlineMetaRow
              icon={MapPin}
              label="Storage"
              value={item.organizationStorageLocation ?? undefined}
            />
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
            <InlineMetaRow
              icon={Calendar}
              label="Found time"
              value={formatFoundTime24h(item.eventTime)}
            />
            <InlineMetaRow
              icon={MapPin}
              label="Found location"
              value={item.organizationFoundLocation ?? undefined}
            />
          </div>
        </div>

        <div className="h-px bg-[#ebebeb]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
          <AttributeCard icon={Calendar} label="Created at" value={item.createdAt ? new Date(item.createdAt).toLocaleString() : null} />

          <AttributeCard icon={ScanSearch} label={cat === 'Others' ? 'Item identifier' : 'Item name'} value={itemNameValue} />
          <AttributeCard icon={Palette} label="Color" value={getInventoryColor(item)} />

          <AttributeCard icon={Tag} label="Brand" value={getInventoryBrand(item)} />
          <AttributeCard icon={Layers3} label="Material" value={getInventoryMaterial(item)} />

          {getInventoryCondition(item) ? (
            <AttributeCard icon={Layers3} label="Condition" value={getInventoryCondition(item)} />
          ) : null}
          <AttributeCard icon={Ruler} label="Size" value={getInventorySize(item)} />

          {cat === 'Electronics' ? (
            <AttributeCard icon={Layers3} label="Model" value={getInventoryModel(item)} />
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
        </div>

        {getInventoryDistinctiveMarks(item) ? (
          <div className="pt-2">
            <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">Distinctive marks</div>
            <div className="mt-2 flex items-start gap-2 text-[#222222]">
              <Fingerprint className="w-4 h-4 text-[#a8a8a8] shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed break-words">{getInventoryDistinctiveMarks(item)}</span>
            </div>
          </div>
        ) : null}

        {cat === 'Cards' ? (
          <div className="pt-2">
            <div className="text-xs font-semibold text-[#222222] uppercase tracking-wide">Dates</div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <InlineMetaRow icon={Calendar} label="Date of birth" value={formatInventoryDateOnly(item.cardDetail?.dateOfBirth ?? undefined)} />
              <InlineMetaRow icon={Calendar} label="Issue date" value={formatInventoryDateOnly(item.cardDetail?.issueDate ?? undefined)} />
              <InlineMetaRow icon={Calendar} label="Expiry date" value={formatInventoryDateOnly(item.cardDetail?.expiryDate ?? undefined)} />
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

        {/* QR (link to item detail) */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wide">QR code</div>
          {orgSlug ? (
            <ItemQrCard orgSlug={orgSlug} itemId={item.id} />
          ) : (
            <div className="mt-3 text-xs text-[#929292]">Missing organization slug — cannot generate QR.</div>
          )}
        </div>
      </div>
    </>
  )
}

function ItemQrCard({ orgSlug, itemId }: { orgSlug: string; itemId: string }) {
  const itemUrl = useMemo(() => {
    return `https://backtrack-console.vercel.app/console/${orgSlug}/staff/item/${itemId}`
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
    <div className="mt-3 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-[#a8a8a8]">
          Scan to open this item. 
        </div>
      </div>

      <div className="shrink-0 -mt-10 rounded-[12px] border border-[#dddddd] bg-white p-3 flex flex-col items-center justify-center gap-2">
        <div ref={qrWrapRef}>
          <QRCode value={itemUrl} size={88} />
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
