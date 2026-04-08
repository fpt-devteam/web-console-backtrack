import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ItemCategory } from '@/services/inventory.service'
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { FinderInfo } from './step2-finder'
import type { PhotoPreview } from './step1-photos-item'

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-slate-100 last:border-0">
      <div className="text-sm font-semibold text-slate-950">{label}</div>
      <div className="text-sm text-slate-950 text-right break-words max-w-[70%]">{value?.trim() ? value : '—'}</div>
    </div>
  )
}

export type StaffInfo = {
  fullName: string
  email: string
  staffId: string
}

export function Step3Preview({
  photoPreviews,
  item,
  finder,
  staff,
  setStaff,
  isSubmitting,
  onBack,
  onSaveAndAddAnother,
  onSubmit,
}: {
  photoPreviews: PhotoPreview[]
  item: {
    itemName: string
    description: string
    distinctiveMarks: string
    category: ItemCategory
    color: string
    brand: string
    condition: string
    material: string
    size: string
  }
  finder: FinderInfo
  staff: StaffInfo
  setStaff: (next: StaffInfo) => void
  isSubmitting: boolean
  onBack: () => void
  onSaveAndAddAnother: () => void
  onSubmit: () => void
}) {
  return (
    <div className="space-y-8 mt-6">
      <div>
        <div className="text-sm font-semibold text-slate-950">Step 3</div>
        <div className="text-2xl font-bold text-slate-950">Preview</div>
        <div className="text-sm text-slate-800 mt-1">Review everything before submitting.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Item */}
        <div className="rounded-xl border border-slate-200 overflow-hidden lg:col-span-1">
          <div className="bg-sky-100 border-b border-sky-200 px-5 py-4">
            <div className="text-sm font-bold uppercase tracking-wide text-slate-950">Item</div>
            <div className="text-sm text-slate-900 mt-1">What was found</div>
          </div>
          <div className="px-5">
            <FieldRow label="Item name" value={item.itemName} />
            <FieldRow label="Category" value={item.category} />
            <FieldRow label="Brand" value={item.brand} />
            <FieldRow label="Color" value={item.color} />
            <FieldRow label="Condition" value={item.condition} />
            <FieldRow label="Material" value={item.material} />
            <FieldRow label="Size" value={item.size} />
            <FieldRow label="Distinctive marks" value={item.distinctiveMarks} />
            <FieldRow label="Description" value={item.description} />
          </div>

          {photoPreviews.length > 0 ? (
            <div className="p-5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-950 mb-3">Photos</div>
              <div className="flex gap-3 flex-wrap">
                {photoPreviews.map((p) => (
                  <img
                    key={p.url}
                    src={p.url}
                    alt="Preview"
                    className="h-16 w-16 rounded-md object-cover border border-slate-200"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Finder + Staff */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-100 border-b border-sky-200 px-5 py-4">
              <div className="text-sm font-bold uppercase tracking-wide text-slate-950">Finder</div>
              <div className="text-sm text-slate-900 mt-1">Who found or handed in the item</div>
            </div>
            <div className="px-5">
              <FieldRow label="Full name" value={finder.fullName} />
              <FieldRow label="Email" value={finder.email} />
              <FieldRow label="Phone" value={finder.phone} />
              <FieldRow label="National ID" value={finder.nationalId} />
              <FieldRow label="Student / staff ID" value={finder.orgMemberId} />
              <FieldRow label="Handover time" value={finder.handoverTime} />
              <FieldRow label="From · To" value={finder.fromTo} />
              <FieldRow label="Receiving staff" value={finder.receivingStaff} />
              <FieldRow label="Notes" value={finder.notes} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-100 border-b border-sky-200 px-5 py-4">
              <div className="text-sm font-bold uppercase tracking-wide text-slate-950">Staff</div>
              <div className="text-sm text-slate-900 mt-1">Staff who logs this record</div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-slate-950">Full name</Label>
                  <Input
                    value={staff.fullName}
                    onChange={(e) => setStaff({ ...staff, fullName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-950">Email</Label>
                  <Input
                    value={staff.email}
                    onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-950">Staff ID</Label>
                  <Input
                    value={staff.staffId}
                    onChange={(e) => setStaff({ ...staff, staffId: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          className="border-slate-200 text-slate-950 hover:bg-slate-50"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={onSaveAndAddAnother} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save & add another
          </Button>
          <Button
            type="button"
            aria-label="Submit"
            className="mb-2 h-8 w-8 rounded-full bg-slate-950 text-white hover:bg-slate-800"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : <ChevronRight className="h-5 w-5 mx-auto" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

