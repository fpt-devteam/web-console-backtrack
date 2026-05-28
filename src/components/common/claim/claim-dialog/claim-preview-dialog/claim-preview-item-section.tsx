import cardIcon from '@/assets/icons/cards/card_icon.png'
import electronicsIcon from '@/assets/icons/electronics/electronics_icon.png'
import othersIcon from '@/assets/icons/others/others_icon.png'
import personalBelongingIcon from '@/assets/icons/personal_belongings/personal_belonging_icon.png'
import { formatDateTime } from '@/utils/datetime.util'
import type { SupportFormData } from '@/types/chat.types'
import type { ItemCategory } from '@/services/inventory.service'
import { CATEGORY_COLOR } from '@/components/common/claim/claim-card/claim-card.constants'

interface ClaimPreviewItemSectionProps {
  supportFormData?: SupportFormData | null
  createdAt?: string | null
}

const CATEGORY_ICON: Record<ItemCategory, string> = {
  PersonalBelongings: personalBelongingIcon,
  Cards:              cardIcon,
  Electronics:        electronicsIcon,
  Others:             othersIcon,
}

function ItemImage({ src, alt, category, className }: { src?: string; alt: string; category?: string | null; className?: string }) {
  if (src) {
    return (
      <div className={`overflow-hidden border border-hairline ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }
  const key = (category ?? 'Others') as ItemCategory
  const icon = CATEGORY_ICON[key]
  const { bg } = CATEGORY_COLOR[key]
  return (
    <div className={`border border-hairline flex items-center justify-center overflow-hidden ${bg} ${className}`}>
      <img src={icon} alt={category ?? 'Others'} className="w-1/2 h-1/2 object-contain scale-[1.3]" />
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  )
}

export function ClaimPreviewItemSection({ supportFormData, createdAt }: ClaimPreviewItemSectionProps) {
  const imageUrls = supportFormData?.imageUrls ?? []
  const [primary, ...thumbs] = imageUrls
  const itemName  = supportFormData?.itemName ?? 'Unknown item'
  const category  = supportFormData?.category ?? null
  const lostWhere = supportFormData?.lostLocation ?? '—'
  const lostWhen  = supportFormData?.eventTime
    ? formatDateTime(new Date(supportFormData.eventTime).toISOString())
    : '—'
  const opened = createdAt ? formatDateTime(createdAt) : '—'

  const { bg: catBg, text: catText } = CATEGORY_COLOR[(category ?? 'Others') as ItemCategory]

  return (
    <div className="flex gap-4 px-5 py-4">
      <div className="shrink-0 flex gap-2">
        <ItemImage
          src={primary}
          alt={itemName}
          category={category}
          className="w-24 h-24 rounded-xl"
        />
        {thumbs.length > 0 && (
          <div className="flex flex-col gap-2">
            {thumbs.slice(0, 2).map((url, i) => (
              <ItemImage
                key={i}
                src={url}
                alt={itemName}
                category={category}
                className="w-11 h-11 rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-ink leading-snug">{itemName}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {category && (
              <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${catBg} ${catText}`}>
                {category}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <MetaRow label="Lost where" value={lostWhere} />
          <MetaRow label="Lost when"  value={lostWhen} />
          <MetaRow label="Opened"     value={opened} />
        </div>
      </div>
    </div>
  )
}
