import cardIcon from '@/assets/icons/cards/card_icon.png'
import electronicsIcon from '@/assets/icons/electronics/electronics_icon.png'
import othersIcon from '@/assets/icons/others/others_icon.png'
import personalBelongingIcon from '@/assets/icons/personal_belongings/personal_belonging_icon.png'
import type { ItemCategory } from '@/services/inventory.service'
import { CATEGORY_COLOR } from './claim-card.constants'

interface ClaimCardImageProps {
  src?: string | null
  alt: string
  category?: string | null
  subcategoryIcon?: string | null
}

const CATEGORY_ICON: Record<ItemCategory, string> = {
  PersonalBelongings: personalBelongingIcon,
  Cards:              cardIcon,
  Electronics:        electronicsIcon,
  Others:             othersIcon,
}

function CategoryFallback({ category, subcategoryIcon }: { category?: string | null; subcategoryIcon?: string | null }) {
  // Validate against the map at runtime: an unknown/empty category — e.g. a
  // realtime `queue:new` claim that arrives without supportFormData — falls back
  // to 'Others' instead of indexing the map with a missing key.
  const key: ItemCategory = category && category in CATEGORY_COLOR ? (category as ItemCategory) : 'Others'
  const icon = subcategoryIcon ?? CATEGORY_ICON[key]
  const { bg } = CATEGORY_COLOR[key]

  return (
    <div className={`w-16 h-16 rounded-lg border border-hairline flex items-center justify-center shrink-0 overflow-hidden ${bg}`}>
      <img src={icon} alt={category ?? 'Others'} className="w-10 h-10 object-contain transition-transform duration-200 scale-[1.3] group-hover:scale-[1.5]" />
    </div>
  )
}

export function ClaimCardImage({ src, alt, category, subcategoryIcon }: ClaimCardImageProps) {
  if (src) {
    return (
      <div className="w-20 h-20 rounded-lg border border-hairline shrink-0 overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 scale-[1] group-hover:scale-[1.1]"
        />
      </div>
    )
  }
  return <CategoryFallback category={category} subcategoryIcon={subcategoryIcon} />
}
