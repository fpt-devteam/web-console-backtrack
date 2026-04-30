import { Button } from '@/components/ui/button'
import type { ItemCategory } from '@/services/inventory.service'
import { ChevronLeft, Loader2 } from 'lucide-react'
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

function FieldCell({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="py-2">
      <div className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-sm text-[#222222] break-words">{value?.trim() ? value : '—'}</div>
    </div>
  )
}

function formatFoundTime(v: string): string {
  const t = v?.trim()
  if (!t) return '—'
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return v
  // 24h format for VN locale
  return format(d, 'dd/MM/yyyy HH:mm')
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const photos = useMemo(() => photoPreviews.map((p) => p.url), [photoPreviews])
  const mainPhoto = photos[0] ?? null

  return (
    <div className="space-y-4 mt-6">
      <div>
        <div className="text-xl font-bold text-[#222222]">Preview</div>
        <div className="text-xs text-[#6a6a6a] ">Review everything before submitting.</div>
      </div>

      <div className="rounded-[14px] border border-[#dddddd] overflow-hidden">
        <div className="py-3 ps-5 bg-[#f7f7f7]">
          <div className="text-md font-semibold text-[#222222]">Item</div>
          <div className="text-xs text-[#6a6a6a]">What was found</div>
        </div>

        <div className="border-t border-[#ebebeb] p-5 space-y-5">
          {/* Photos (top, left-to-right, supports many) */}
          {mainPhoto ? (
            <div>
              <div className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wide">Photos</div>
              <div className="mt-2 flex flex-wrap gap-3">
                {photos.map((url, idx) => (
                  <button
                    key={`${url}:${idx}`}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx)
                      setLightboxOpen(true)
                    }}
                    className="w-[160px] h-[110px] rounded-xl overflow-hidden border border-[#dddddd] bg-white hover:border-[#b0b0b0] transition-colors"
                    aria-label={`Open photo ${idx + 1}`}
                  >
                    <img
                      src={url}
                      alt={`Item photo ${idx + 1}`}
                      className="w-full h-full object-contain bg-white"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Item information (below, 2-column grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <FieldCell label="Category" value={item.category} />
                <FieldCell label="Subcategory" value={item.subcategory} />
                <FieldCell label="Post title" value={item.postTitle} />
                <FieldCell label="Found time" value={formatFoundTime(item.eventTime)} />
                <FieldCell label="Internal location" value={item.internalLocation} />
            {c !== 'Others' ? <FieldCell label="Item name" value={item.detailItemName} /> : null}
            {c === 'Others' ? <FieldCell label="Item identifier" value={item.itemName} /> : null}

            {c === 'Cards' ? (
              <>
                <FieldCell label="Holder name" value={item.holderName} />
                <FieldCell label="Card number" value={item.cardNumber} />
                <FieldCell label="Issuing authority" value={item.issuingAuthority} />
                <FieldCell label="Date of birth" value={item.dateOfBirth} />
                <FieldCell label="Issue date" value={item.issueDate} />
                <FieldCell label="Expiry date" value={item.expiryDate} />
              </>
            ) : null}

            {c === 'Others' ? <FieldCell label="Primary color" value={item.color} /> : null}

            {c === 'PersonalBelongings' ? (
              <>
                <FieldCell label="Brand" value={item.brand} />
                <FieldCell label="Color" value={item.color} />
                <FieldCell label="Condition" value={item.condition} />
                <FieldCell label="Material" value={item.material} />
                <FieldCell label="Size" value={item.size} />
              </>
            ) : null}

            {c === 'Electronics' ? (
              <>
                <FieldCell label="Brand" value={item.brand} />
                <FieldCell label="Color" value={item.color} />
                <FieldCell label="Model" value={item.model} />
                <FieldCell label="Screen condition" value={item.condition} />
                <FieldCell label="Has case" value={item.hasCase ? 'Yes' : 'No'} />
                <FieldCell label="Case description" value={item.caseDescription} />
                <FieldCell label="Lock screen description" value={item.lockScreenDescription} />
              </>
            ) : null}

            {c === 'PersonalBelongings' || c === 'Electronics' ? (
              <FieldCell label="Distinctive marks" value={item.distinctiveMarks} />
            ) : null}

            <div className="md:col-span-2">
              <FieldCell label="Additional details" value={item.description} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="py-3 ps-5 bg-[#f7f7f7]">
            <div className="text-md font-semibold text-[#222222]">Finder</div>
            <div className="text-xs text-[#6a6a6a]">Finder — who found or turned in the item</div>
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
            <div className="text-xs text-[#6a6a6a]">Logged for this intake</div>
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
