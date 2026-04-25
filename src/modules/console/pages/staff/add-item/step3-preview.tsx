import { Button } from '@/components/ui/button'
import type { ItemCategory } from '@/services/inventory.service'
import { ChevronLeft, Loader2 } from 'lucide-react'
import type { FinderInfo } from './step2-finder'
import type { PhotoPreview } from './step1-photos-item'

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-[#ebebeb] last:border-0">
      <div className="text-sm font-semibold text-[#222222]">{label}</div>
      <div className="text-sm text-[#222222] text-right break-words max-w-[70%]">{value?.trim() ? value : '—'}</div>
    </div>
  )
}

export type StaffInfo = {
  fullName: string
  email: string
  staffId: string
}

export type PreviewItem = {
  postTitle: string
  detailItemName: string
  itemName: string
  description: string
  distinctiveMarks: string
  category: ItemCategory
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
        <div className="px-5 border-t border-[#ebebeb]">
          <FieldRow label="Category" value={item.category} />
          <FieldRow label="Post title" value={item.postTitle} />
          <FieldRow label="Internal location" value={item.internalLocation} />
          <FieldRow label="Found time" value={item.eventTime} />
          {c !== 'Others' ? <FieldRow label="Item name " value={item.detailItemName} /> : null}
          {c === 'Others' ? <FieldRow label="Item identifier" value={item.itemName} /> : null}

          {c === 'Cards' ? (
            <>
              <FieldRow label="Holder name" value={item.holderName} />
              <FieldRow label="Card number" value={item.cardNumber} />
              <FieldRow label="Issuing authority" value={item.issuingAuthority} />
              <FieldRow label="Date of birth" value={item.dateOfBirth} />
              <FieldRow label="Issue date" value={item.issueDate} />
              <FieldRow label="Expiry date" value={item.expiryDate} />
            </>
          ) : null}

          {c === 'Others' ? <FieldRow label="Primary color" value={item.color} /> : null}

          {c === 'PersonalBelongings' ? (
            <>
              <FieldRow label="Brand" value={item.brand} />
              <FieldRow label="Color" value={item.color} />
              <FieldRow label="Condition" value={item.condition} />
              <FieldRow label="Material" value={item.material} />
              <FieldRow label="Size" value={item.size} />
            </>
          ) : null}

          {c === 'Electronics' ? (
            <>
              <FieldRow label="Brand" value={item.brand} />
              <FieldRow label="Color" value={item.color} />
              <FieldRow label="Model" value={item.model} />
              <FieldRow label="Screen condition" value={item.condition} />
              <FieldRow label="Has case" value={item.hasCase ? 'Yes' : 'No'} />
              <FieldRow label="Case description" value={item.caseDescription} />
              <FieldRow label="Lock screen description" value={item.lockScreenDescription} />
            </>
          ) : null}

          {c === 'PersonalBelongings' || c === 'Electronics' ? (
            <FieldRow label="Distinctive marks" value={item.distinctiveMarks} />
          ) : null}

          <FieldRow label="Additional details" value={item.description} />
        </div>

        {photoPreviews.length > 0 ? (
          <div className="p-5 pt-4 border-t border-[#ebebeb]">
            <div className="text-xs font-bold uppercase tracking-wide text-[#222222] mb-3">Photos</div>
            <div className="flex gap-3 flex-wrap">
              {photoPreviews.map((p) => (
                <img
                  key={p.url}
                  src={p.url}
                  alt="Preview"
                  className="h-16 w-16 rounded-md object-cover border border-[#dddddd]"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        ) : null}
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
            <FieldRow label="Staff ID" value={staff.staffId} />
          </div>
        </div>
      </div>

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
