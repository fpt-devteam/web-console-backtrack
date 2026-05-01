import { Button } from '@/components/ui/button'
import type { ItemCategory } from '@/services/inventory.service'
import {
  Calendar,
  BadgeCheck,
  ChevronLeft,
  Layers3,
  Loader2,
  MapPin,
  Palette,
  Ruler,
  ScanSearch,
  Shirt,
  Tag,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FinderInfo } from './step2-finder'
import type { PhotoPreview } from './step1-photos-item'
import { format } from 'date-fns'

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-[#ebebeb] last:border-0">
      <div className="text-sm font-semibold text-[#222222]">{label}</div>
      <div className="text-sm text-[#222222] text-right break-words max-w-[70%]">{value?.trim() ? value : '—'}</div>
    </div>
  )
}

function formatOrDash(v: string | null | undefined) {
  return v?.trim() ? v.trim() : '—'
}

function formatFoundTime(v: string): string {
  const t = v?.trim()
  if (!t) return '—'
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return v
  // 24h format for VN locale
  return format(d, 'dd/MM/yyyy HH:mm')
}

function categoryLabel(c: ItemCategory): string {
  switch (c) {
    case 'PersonalBelongings':
      return 'Personal Belongings'
    case 'Cards':
      return 'Cards'
    case 'Electronics':
      return 'Electronics'
    case 'Others':
      return 'Others'
  }
}

function CategoryPill({ category, subcategory }: { category: ItemCategory; subcategory: string }) {
  const label = `${categoryLabel(category)} - ${subcategory?.trim() ? subcategory.trim() : '—'}`
  const Icon = Tag
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff0f2] text-[#ff385c]">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
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
      <div className="mt-0.5 text-[#6a6a6a]">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#222222] uppercase tracking-wide">{label}</div>
        <div className="mt-1 text-sm text-[#222222] break-words">{formatOrDash(value)}</div>
      </div>
    </div>
  )
}

function InlineMetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#222222]">
      <Icon className="w-4 h-4 text-[#6a6a6a]" />
      <span className="text-[#222222] font-medium">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export type StaffInfo = {
  fullName: string
  email: string
  staffId?: string
}

export type PreviewItem = {
  postTitle: string
  detailItemName: string
  itemName: string
  description: string
  distinctiveMarks: string
  category: ItemCategory
  subcategory: string
  internalLocation: string
  eventTime: string
  color: string
  brand: string
  condition: string
  material: string
  size: string
  holderName: string
  cardNumber: string
  issuingAuthority: string
  model: string
  hasCase: boolean
  caseDescription: string
  lockScreenDescription: string
  dateOfBirth: string
  issueDate: string
  expiryDate: string
}

export function Step3Preview({
  photoPreviews,
  item,
  finder,
  staff,
  isSubmitting,
  submittingAction,
  onBack,
  onSaveAndAddAnother,
  onSubmit,
}: {
  photoPreviews: PhotoPreview[]
  item: PreviewItem
  finder: FinderInfo
  staff: StaffInfo
  isSubmitting: boolean
  submittingAction: 'save' | 'addAnother' | null
  onBack: () => void
  onSaveAndAddAnother: () => void
  onSubmit: () => void
}) {
  const c = item.category
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const photos = useMemo(() => photoPreviews.map((p) => p.url), [photoPreviews])
  const mainPhoto = photos[mainImageIndex] ?? photos[0] ?? null

  return (
    <div className="space-y-4 mt-2">
      <div>
        <div className="text-xl font-bold text-[#222222]">Preview</div>
        <div className="text-xs text-[#6a6a6a] ">Review everything before submitting.</div>
      </div>

      <div className="rounded-[14px] border border-[#dddddd] overflow-hidden">
        <div className="py-3 ps-5 bg-[#f7f7f7]">
          <div className="text-md font-semibold text-[#222222]">Item</div>
        </div>

        <div className="border-t border-[#ebebeb]">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Images — 1/3 */}
            <div className="lg:col-span-1 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#ebebeb]">
              <div className="relative h-[240px] bg-[#f7f7f7] rounded-[8px] overflow-hidden mb-4 flex items-center justify-center">
                {mainPhoto ? (
                  <button
                    type="button"
                    className="w-full h-full"
                    onClick={() => {
                      setLightboxIndex(mainImageIndex)
                      setLightboxOpen(true)
                    }}
                    aria-label="Open photo preview"
                  >
                    <img src={mainPhoto} alt="Item photo preview" className="w-full h-full object-contain bg-white" />
                  </button>
                ) : (
                  <div className="text-[#929292]">No image</div>
                )}
              </div>

              {photos.length > 1 ? (
                <div className="flex gap-3 flex-wrap">
                  {photos.map((img, idx) => (
                    <button
                      key={`${img}:${idx}`}
                      type="button"
                      onClick={() => setMainImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-[8px] overflow-hidden border-2 transition-all ${
                        mainImageIndex === idx ? 'border-[#ff385c] ring-2 ring-[#fff0f2]' : 'border-[#dddddd] hover:border-[#b0b0b0]'
                      }`}
                      aria-label={`View ${idx + 1}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Info — 2/3 */}
            <div className="lg:col-span-2 py-5 px-5 lg:py-6 lg:px-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#222222] leading-tight">
                    {formatOrDash(item.postTitle)}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <CategoryPill category={item.category} subcategory={item.subcategory} />
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                    <InlineMetaRow icon={Calendar} label="Found time" value={formatFoundTime(item.eventTime)} />
                    <InlineMetaRow icon={MapPin} label="Location" value={formatOrDash(item.internalLocation)} />
                  </div>
                </div>

                <div className="h-px bg-[#ebebeb]" />

                {/* Attribute grid (like detail view) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  {c === 'Cards' ? (
                    <AttributeCard icon={Layers3} label="Issuing authority" value={item.issuingAuthority} />
                  ) : (
                    <AttributeCard icon={Palette} label="Color" value={item.color} />
                  )}

                  {c === 'Cards' ? (
                    <AttributeCard icon={Shirt} label="Holder name" value={item.holderName} />
                  ) : (
                    <AttributeCard icon={Tag} label="Brand" value={item.brand} />
                  )}

                  {c === 'PersonalBelongings' ? (
                    <AttributeCard icon={Layers3} label="Material" value={item.material} />
                  ) : c === 'Electronics' ? (
                    <AttributeCard icon={Layers3} label="Model" value={item.model} />
                  ) : c === 'Cards' ? (
                    <AttributeCard icon={ScanSearch} label="Card number" value={item.cardNumber} />
                  ) : (
                    <AttributeCard icon={Layers3} label="Material" value={item.material} />
                  )}

                  <AttributeCard icon={BadgeCheck} label="Condition" value={item.condition} />

                  {(c === 'PersonalBelongings' || c === 'Electronics') ? (
                    <AttributeCard icon={ScanSearch} label="Distinctive marks" value={item.distinctiveMarks} />
                  ) : (
                    <AttributeCard icon={ScanSearch} label="Details" value={item.description} />
                  )}

                  {c === 'PersonalBelongings' ? (
                    <AttributeCard icon={Ruler} label="Size" value={item.size} />
                  ) : null}

                  {/* Fallback: show details when not already shown */}
                  {c !== 'PersonalBelongings' && c !== 'Electronics' ? null : (
                    <div className="sm:col-span-2 pt-2">
                      <div className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wide">Additional details</div>
                      <div className="mt-1 text-sm text-[#222222] break-words">{formatOrDash(item.description)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="py-3 ps-5 bg-[#f7f7f7]">
            <div className="text-md font-semibold text-[#222222]">Finder</div>
          </div>
          <div className="p-5 space-y-2 text-sm">
            <FieldRow label="Full name" value={finder.fullName} />
            <FieldRow label="Email" value={finder.email} />
            <FieldRow label="Phone" value={finder.phone} />
            <FieldRow label="National ID" value={finder.nationalId} />
            <FieldRow label="Student / staff ID" value={finder.orgMemberId} />
          </div>
        </div>

        <div className="rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="py-3 ps-5 bg-[#f7f7f7]">
            <div className="text-md font-semibold text-[#222222]">Receiving staff</div>
          </div>
          <div className="p-5 space-y-2 text-sm">
            <FieldRow label="Name" value={staff.fullName} />
            <FieldRow label="Email" value={staff.email} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && photos[lightboxIndex] ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close image preview"
            onClick={() => setLightboxOpen(false)}
          />
          <div className="relative h-full w-full p-4 sm:p-6 flex items-center justify-center">
            <div className="relative w-full max-w-4xl bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
              <div className="p-3 border-b border-[#ebebeb] flex items-center justify-between">
                <div className="text-sm font-semibold text-[#222222]">Photo preview</div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-sm text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222]"
                  onClick={() => setLightboxOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="p-4 bg-white">
                <img
                  src={photos[lightboxIndex]}
                  alt={`Photo ${lightboxIndex + 1}`}
                  className="w-full max-h-[70vh] object-contain bg-white"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#ebebeb]">
        <Button
          type="button"
          aria-label="Back"
          className="h-8 w-8 rounded-full bg-[#222222] text-white hover:bg-[#444444]"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-5 w-5 mx-auto" />
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveAndAddAnother}
            disabled={isSubmitting}
            className="border-[#dddddd]"
          >
            {submittingAction === 'addAnother' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              'Save & add another'
            )}
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting} className="bg-[#222222] hover:bg-[#444444]">
            {submittingAction === 'save' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
