import { Printer } from 'lucide-react'
import { Button } from '@/components/common/core/button'
import type { SupportFormData } from '@/types/chat.types'
import type { ItemCategory } from '@/services/inventory.service'
import { formatDateTime } from '@/utils/datetime.util'
import { CATEGORY_COLOR } from '@/components/common/claim/claim.constants'
import cardIcon from '@/assets/icons/cards/card_icon.png'
import electronicsIcon from '@/assets/icons/electronics/electronics_icon.png'
import othersIcon from '@/assets/icons/others/others_icon.png'
import personalBelongingIcon from '@/assets/icons/personal_belongings/personal_belonging_icon.png'

const CATEGORY_ICON: Record<ItemCategory, string> = {
  PersonalBelongings: personalBelongingIcon,
  Cards:              cardIcon,
  Electronics:        electronicsIcon,
  Others:             othersIcon,
}

interface ClaimItemCardProps {
  supportFormData: SupportFormData
  onPrintSlip?: () => void
}

function ItemImage({ src, alt, category }: { src?: string | null; alt: string; category?: string | null }) {
  if (src) {
    return (
      <div className="w-28 h-28 rounded-xl border border-hairline shrink-0 overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }
  const key = (category ?? 'Others') as ItemCategory
  const icon = CATEGORY_ICON[key]
  const { bg } = CATEGORY_COLOR[key]
  return (
    <div className={`w-28 h-28 rounded-xl border border-hairline flex items-center justify-center shrink-0 ${bg}`}>
      <img src={icon} alt={category ?? 'Others'} className="w-14 h-14 object-contain" />
    </div>
  )
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">{label}</span>
      <span className="text-sm text-ink">{value ?? '—'}</span>
    </div>
  )
}

export function ClaimItemCard({ supportFormData, onPrintSlip }: ClaimItemCardProps) {
  const images = supportFormData.imageUrls ?? []
  const [primary, ...thumbs] = images

  const key = supportFormData.category as ItemCategory
  const { bg, text } = CATEGORY_COLOR[key]

  const lostWhen = supportFormData.eventTime
    ? formatDateTime(new Date(supportFormData.eventTime).toISOString())
    : '—'

  return (
    <div className="bg-white rounded-xl border border-hairline">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline">
        <span className="text-xs font-bold tracking-widest text-mute uppercase flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-neutral-200" />
          Claim Item
        </span>
        {onPrintSlip && (
          <Button variant="ghost" size="sm" onClick={onPrintSlip} className="text-mute">
            <Printer className="w-3.5 h-3.5" />
            Print slip
          </Button>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="flex gap-3">
          <ItemImage src={primary} alt={supportFormData.itemName} category={supportFormData.category} />
          {thumbs.slice(0, 2).map((url, i) => (
            <ItemImage key={i} src={url} alt={supportFormData.itemName} category={supportFormData.category} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-ink">{supportFormData.itemName}</h3>
          {supportFormData.category && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${text}`}>
              {supportFormData.category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <DetailField label="Color"      value={supportFormData.color} />
          <DetailField label="Lost when"  value={lostWhen} />
          <DetailField label="Lost where" value={supportFormData.lostLocation} />
          {supportFormData.additionalDetails && (
            <div className="col-span-2 flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">
                Distinguishing features
              </span>
              <span className="text-sm text-ink">{supportFormData.additionalDetails}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
