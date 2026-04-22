import type { InventorySubcategory, ItemCategory } from '@/services/inventory.service'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import iconCards from '@/assets/icons/cards/card_icon.png'
import iconElectronics from '@/assets/icons/electronics/electronics_icon.png'
import iconOthers from '@/assets/icons/others/others_icon.png'
import iconPersonal from '@/assets/icons/personal_belongings/personal_belonging_icon.png'

const subcategoryIconLoaders = import.meta.glob('@/assets/icons/**/*.png', {
  import: 'default',
}) as Record<string, () => Promise<string>>

const subcategoryFileNameOverrides: Record<string, string> = {
  smartwatch: 'smart_watch',
}

function categoryFolder(c: ItemCategory): string {
  switch (c) {
    case 'PersonalBelongings':
      return 'personal_belongings'
    case 'Cards':
      return 'cards'
    case 'Electronics':
      return 'electronics'
    case 'Others':
      return 'others'
  }
}

function getSubcategoryIconKey(category: ItemCategory, code: string): string | null {
  const folder = categoryFolder(category)
  const fileBase = (subcategoryFileNameOverrides[code] ?? code).trim()
  if (!fileBase) return null

  const key = Object.keys(subcategoryIconLoaders).find(
    (k) => k.includes(`/assets/icons/${folder}/`) && k.endsWith(`/${fileBase}.png`),
  )
  return key ?? null
}

function categoryLabel(c: ItemCategory) {
  switch (c) {
    case 'PersonalBelongings':
      return 'Personal belongings'
    case 'Cards':
      return 'Cards'
    case 'Electronics':
      return 'Electronics'
    case 'Others':
      return 'Others'
  }
}

function CategoryIcon({ category }: { category: ItemCategory }) {
  switch (category) {
    case 'PersonalBelongings':
      return <img src={iconPersonal} alt="" className="h-7 w-7 object-contain" aria-hidden loading="lazy" decoding="async" />
    case 'Cards':
      return <img src={iconCards} alt="" className="h-7 w-7 object-contain" aria-hidden loading="lazy" decoding="async" />
    case 'Electronics':
      return <img src={iconElectronics} alt="" className="h-7 w-7 object-contain" aria-hidden loading="lazy" decoding="async" />
    case 'Others':
      return <img src={iconOthers} alt="" className="h-7 w-7 object-contain" aria-hidden loading="lazy" decoding="async" />
  }
}

export function Step0PickSubcategory({
  subcategories,
  onPick,
}: {
  subcategories: InventorySubcategory[]
  onPick: (pick: { category: ItemCategory; subcategory: InventorySubcategory }) => void
}) {
  const categories: ItemCategory[] = ['PersonalBelongings', 'Cards', 'Electronics', 'Others']

  const byCategory = useMemo(
    () =>
      categories.map((c) => ({
        category: c,
        items: subcategories.filter((s) => s.category === c),
      })),
    [subcategories],
  )

  const [openByCategory, setOpenByCategory] = useState<Record<ItemCategory, boolean>>(() => ({
    PersonalBelongings: true,
    Cards: true,
    Electronics: false,
    Others: false,
  }))

  // Lazy-load subcategory icons on demand (avoid bundling all icons eagerly).
  const [subcategoryIconSrcByKey, setSubcategoryIconSrcByKey] = useState<Record<string, string>>({})

  useEffect(() => {
    const keys = new Set<string>()
    for (const { category, items } of byCategory) {
      if (!openByCategory[category]) continue
      for (const s of items) {
        const k = getSubcategoryIconKey(category, s.code)
        if (k) keys.add(k)
      }
    }

    keys.forEach((k) => {
      if (subcategoryIconSrcByKey[k]) return
      const loader = subcategoryIconLoaders[k]
      if (!loader) return
      void loader().then((src) => {
        setSubcategoryIconSrcByKey((prev) => (prev[k] ? prev : { ...prev, [k]: src }))
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byCategory, openByCategory])

  return (
    <div className="space-y-6 mt-4">
      <div>
        <div className="text-xl font-bold text-slate-950">Choose an item type</div>
        <div className="text-xs text-slate-700 mt-1">
          Pick the best matching subcategory. This helps AI analyze and the system classify correctly.
        </div>
      </div>

      <div className="space-y-8">
        {byCategory.map(({ category, items }) => (
          <section key={category} className="space-y-3">
            <button
              type="button"
              onClick={() =>
                setOpenByCategory((prev) => ({
                  ...prev,
                  [category]: !prev[category],
                }))
              }
              className="w-full flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              aria-expanded={openByCategory[category]}
            >
              <div className="flex items-center gap-2">
                <CategoryIcon category={category} />
                <div className="text-sm font-semibold text-slate-950">{categoryLabel(category)}</div>
                <div className="text-xs text-slate-600">({items.length})</div>
              </div>
              <ChevronDown
                className={[
                  'h-4 w-4 text-slate-600 transition-transform',
                  openByCategory[category] ? 'rotate-180' : 'rotate-0',
                ].join(' ')}
                aria-hidden
              />
            </button>

            {openByCategory[category] ? (
              items.length === 0 ? (
                <div className="text-sm text-slate-600 px-2">No subcategories available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => onPick({ category, subcategory: s })}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400 hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                          {(() => {
                            const k = getSubcategoryIconKey(category, s.code)
                            const src = k ? subcategoryIconSrcByKey[k] : null
                            return src ? (
                            <img
                              src={src}
                              alt=""
                              className="h-8 w-8 object-contain"
                              aria-hidden
                              loading="lazy"
                              decoding="async"
                            />
                            ) : (
                            <CategoryIcon category={category} />
                            )
                          })()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-950 truncate">{s.name}</div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Code: <span className="font-mono">{s.code}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-700 group-hover:text-slate-900">
                        Continue to details →
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}

