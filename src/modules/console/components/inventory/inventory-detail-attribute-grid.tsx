import { Building2, Calendar, Info, MapPin, Tag } from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import { inventoryStatusLabel } from './status'
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

function Cell({
  label,
  children,
  fullWidth,
}: {
  label: string
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : undefined}>
      <div className="text-sm font-semibold uppercase mb-2">{label}</div>
      <div
        className={
          fullWidth
            ? 'flex items-start gap-2 min-w-0 text-gray-900 text-sm break-words leading-relaxed'
            : 'flex items-center gap-2 text-gray-900 min-w-0'
        }
      >
        {children}
      </div>
    </div>
  )
}

function TextValue({ v }: { v: string | null | undefined }) {
  return <span>{v?.trim() ? v.trim() : '—'}</span>
}

export function InventoryDetailAttributeGrid({
  item,
  subcategoryNameById,
}: {
  item: InventoryItem
  subcategoryNameById?: Record<string, string>
}) {
  const subName = getInventorySubcategoryName(item, subcategoryNameById)
  const cat = item.category
  const aiDesc = getInventoryAiDescription(item)
  const detailItemName =
    item.personalBelongingDetail?.itemName ??
    item.electronicDetail?.itemName ??
    item.cardDetail?.itemName ??
    null
  const itemNameLabel = cat === 'Others' ? 'ITEM IDENTIFIER' : 'ITEM NAME'
  const itemNameValue = cat === 'Others' ? item.otherDetail?.itemName : detailItemName

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Cell label="STATUS">
          <>
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{inventoryStatusLabel(item.status)}</span>
          </>
        </Cell>

        <Cell label={itemNameLabel}>
          <TextValue v={itemNameValue} />
        </Cell>

        <Cell label="CATEGORY">
          <>
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <TextValue v={item.category} />
          </>
        </Cell>

        <Cell label="SUBCATEGORY">
          <>
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <TextValue v={subName.trim() ? subName : null} />
          </>
        </Cell>

        <Cell label="INTERNAL LOCATION" fullWidth>
          <>
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" aria-hidden />
            <span className="min-w-0 flex-1">
              <TextValue v={item.internalLocation} />
            </span>
          </>
        </Cell>

        <Cell label="FOUND TIME">
          <>
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <TextValue v={item.eventTime ? new Date(item.eventTime).toLocaleString() : null} />
          </>
        </Cell>

        <Cell label="CREATED AT">
          <>
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <TextValue v={item.createdAt ? new Date(item.createdAt).toLocaleString() : null} />
          </>
        </Cell>

        {cat === 'PersonalBelongings' ? (
          <>
            <Cell label="BRAND">
              <TextValue v={getInventoryBrand(item)} />
            </Cell>
            <Cell label="COLOR">
              <TextValue v={getInventoryColor(item)} />
            </Cell>
            <Cell label="CONDITION">
              <TextValue v={getInventoryCondition(item)} />
            </Cell>
            <Cell label="MATERIAL">
              <TextValue v={getInventoryMaterial(item)} />
            </Cell>
            <Cell label="SIZE">
              <TextValue v={getInventorySize(item)} />
            </Cell>
          </>
        ) : null}

        {cat === 'Electronics' ? (
          <>
            <Cell label="BRAND">
              <TextValue v={getInventoryBrand(item)} />
            </Cell>
            <Cell label="COLOR">
              <TextValue v={getInventoryColor(item)} />
            </Cell>
            <Cell label="MODEL">
              <TextValue v={getInventoryModel(item)} />
            </Cell>
            <Cell label="SCREEN CONDITION" fullWidth>
              <TextValue v={getInventoryCondition(item)} />
            </Cell>
            <Cell label="LOCK SCREEN" fullWidth>
              <TextValue v={item.electronicDetail?.lockScreenDescription} />
            </Cell>
            <Cell label="CASE" fullWidth>
              <TextValue v={item.electronicDetail?.caseDescription} />
            </Cell>
          </>
        ) : null}

        {cat === 'Cards' ? (
          <>
            <Cell label="HOLDER NAME">
              <TextValue v={item.cardDetail?.holderName} />
            </Cell>
            <Cell label="CARD NUMBER">
              <TextValue v={item.cardDetail?.cardNumberMasked} />
            </Cell>
            <Cell label="ISSUING AUTHORITY">
              <TextValue v={item.cardDetail?.issuingAuthority} />
            </Cell>
            <Cell label="DATE OF BIRTH">
              <TextValue v={formatInventoryDateOnly(item.cardDetail?.dateOfBirth ?? undefined)} />
            </Cell>
            <Cell label="ISSUE DATE">
              <TextValue v={formatInventoryDateOnly(item.cardDetail?.issueDate ?? undefined)} />
            </Cell>
            <Cell label="EXPIRY DATE">
              <TextValue v={formatInventoryDateOnly(item.cardDetail?.expiryDate ?? undefined)} />
            </Cell>
            <Cell label="OCR TEXT" fullWidth>
              <span className="whitespace-pre-wrap break-words">{item.cardDetail?.ocrText?.trim() || '—'}</span>
            </Cell>
          </>
        ) : null}

        {cat === 'Others' ? (
          <>
            <Cell label="ITEM IDENTIFIER">
              <TextValue v={item.otherDetail?.itemName} />
            </Cell>
            <Cell label="PRIMARY COLOR" fullWidth>
              <TextValue v={item.otherDetail?.primaryColor} />
            </Cell>
          </>
        ) : null}
      </div>

      {getInventoryDistinctiveMarks(item) ? (
        <div>
          <div className="text-sm font-semibold uppercase mb-2">DISTINCTIVE MARKS</div>
          <div className="flex items-center gap-2 text-gray-900">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>{getInventoryDistinctiveMarks(item)}</span>
          </div>
        </div>
      ) : null}

      <div>
        <div className="text-sm font-semibold uppercase mb-2">Additional details</div>
        <p className="text-sm text-gray-700 leading-relaxed">{getInventoryDescription(item) ?? '—'}</p>
      </div>

      {aiDesc ? (
        <div>
          <div className="text-sm font-semibold uppercase mb-2">AI description</div>
          <p className="text-sm text-gray-700 leading-relaxed">{aiDesc}</p>
        </div>
      ) : null}
    </>
  )
}
