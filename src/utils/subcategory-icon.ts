import type { ItemCategory } from '@/services/inventory.service'

const icons = import.meta.glob('@/assets/icons/**/*.png', {
  import: 'default',
  eager: true,
}) as Record<string, string>

const FILE_OVERRIDES: Record<string, string> = {
  smartwatch: 'smart_watch',
}

function categoryFolder(category: ItemCategory): string {
  switch (category) {
    case 'PersonalBelongings': return 'personal_belongings'
    case 'Cards':              return 'cards'
    case 'Electronics':        return 'electronics'
    case 'Others':             return 'others'
  }
}

export function getSubcategoryIcon(category: ItemCategory, code: string): string | null {
  const folder = categoryFolder(category)
  const fileBase = (FILE_OVERRIDES[code] ?? code).trim()
  if (!fileBase) return null
  const key = Object.keys(icons).find(
    (k) => k.includes(`/assets/icons/${folder}/`) && k.endsWith(`/${fileBase}.png`)
  )
  return key ? icons[key] : null
}
