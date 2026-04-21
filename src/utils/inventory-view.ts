import type {
  InventoryItem,
  InventoryListItem,
  PersonalBelongingDetail,
  ElectronicDetail,
  OtherDetail,
  CardDetail,
} from '@/services/inventory.service'

type AnyInventory = InventoryItem | InventoryListItem

export function getInventoryPrimaryDetail(item: AnyInventory):
  | PersonalBelongingDetail
  | ElectronicDetail
  | OtherDetail
  | CardDetail
  | null {
  return (
    item.personalBelongingDetail ??
    item.electronicDetail ??
    item.otherDetail ??
    item.cardDetail ??
    null
  )
}

export function getInventorySubcategoryName(item: AnyInventory, subcategoryNameById?: Record<string, string>): string {
  const n = subcategoryNameById?.[item.subcategoryId]?.trim()
  return n ?? ''
}

/**
 * "Display title" for inventory cards/headers.
 * Others / Cards use explicit identifiers. Personal / Electronics have no single title field on BE,
 * so we derive a short label from subcategory + brand/model when present.
 */
export function getInventoryTitle(item: AnyInventory, subcategoryNameById?: Record<string, string>): string {
  if (item.postTitle?.trim()) return item.postTitle.trim()

  if (item.otherDetail?.itemName?.trim()) return item.otherDetail.itemName.trim()
  if (item.cardDetail?.holderName?.trim()) return item.cardDetail.holderName.trim()

  const sub = getInventorySubcategoryName(item, subcategoryNameById).trim()

  if (item.electronicDetail) {
    const e = item.electronicDetail
    const parts = [e.brand?.trim(), e.model?.trim()].filter(Boolean)
    if (parts.length) return parts.join(' ')
    return sub || 'Electronics item'
  }

  if (item.personalBelongingDetail) {
    const b = item.personalBelongingDetail.brand?.trim()
    if (b && sub) return `${sub} · ${b}`
    if (b) return b
    return sub || 'Personal item'
  }

  return sub || ''
}

export function getInventoryDescription(item: AnyInventory): string | null {
  const d =
    item.personalBelongingDetail?.additionalDetails ??
    item.electronicDetail?.additionalDetails ??
    item.otherDetail?.additionalDetails ??
    item.cardDetail?.additionalDetails ??
    null

  const t = typeof d === 'string' ? d.trim() : ''
  return t ? t : null
}

export function getInventoryModel(item: AnyInventory): string | null {
  const m = item.electronicDetail?.model
  const t = typeof m === 'string' ? m.trim() : ''
  return t ? t : null
}

export function getInventoryBrand(item: AnyInventory): string | null {
  const b = item.personalBelongingDetail?.brand ?? item.electronicDetail?.brand ?? null
  const t = typeof b === 'string' ? b.trim() : ''
  return t ? t : null
}

export function getInventoryColor(item: AnyInventory): string | null {
  const c =
    item.personalBelongingDetail?.color ??
    item.electronicDetail?.color ??
    item.otherDetail?.primaryColor ??
    null
  const t = typeof c === 'string' ? c.trim() : ''
  return t ? t : null
}

export function getInventoryCondition(item: AnyInventory): string | null {
  const c = item.personalBelongingDetail?.condition ?? item.electronicDetail?.screenCondition ?? null
  const t = typeof c === 'string' ? c.trim() : ''
  return t ? t : null
}

export function getInventoryMaterial(item: AnyInventory): string | null {
  const m = item.personalBelongingDetail?.material ?? null
  const t = typeof m === 'string' ? m.trim() : ''
  return t ? t : null
}

export function getInventorySize(item: AnyInventory): string | null {
  const s = item.personalBelongingDetail?.size ?? null
  const t = typeof s === 'string' ? s.trim() : ''
  return t ? t : null
}

export function getInventoryDistinctiveMarks(item: AnyInventory): string | null {
  const m =
    item.personalBelongingDetail?.distinctiveMarks ??
    item.electronicDetail?.distinguishingFeatures ??
    null
  const t = typeof m === 'string' ? m.trim() : ''
  return t ? t : null
}

/** First non-empty AI description on any detail block (BE `AiDescription`). */
export function getInventoryAiDescription(item: AnyInventory): string | null {
  const d =
    item.personalBelongingDetail?.aiDescription ??
    item.electronicDetail?.aiDescription ??
    item.otherDetail?.aiDescription ??
    item.cardDetail?.aiDescription ??
    null
  const t = typeof d === 'string' ? d.trim() : ''
  return t ? t : null
}

/** Display `YYYY-MM-DD` (or leading slice) without timezone shift. */
export function formatInventoryDateOnly(v: string | null | undefined): string {
  if (!v?.trim()) return '—'
  const s = v.trim().slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-')
    if (y && m && d) return `${d}/${m}/${y}`
  }
  return v.trim()
}

