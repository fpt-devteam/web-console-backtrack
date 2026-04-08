import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export type FinderInfo = {
  fullName: string
  email: string
  nationalId: string
  orgMemberId: string
  phone: string
  handoverTime: string // datetime-local value
  fromTo: string
  receivingStaff: string
  notes: string
}

export function Step2Finder({
  finder,
  setFinder,
  onBack,
  onNext,
}: {
  finder: FinderInfo
  setFinder: (next: FinderInfo) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-8 mt-6">
      <div>
        <div className="text-sm font-semibold text-slate-950">Step 2</div>
        <div className="text-2xl font-bold text-slate-950">Finder information</div>
        <div className="text-sm text-slate-800 mt-1">
          Full name is required. Provide at least one detail: email, phone, national ID, or student/staff ID.
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-sky-100 border-b border-sky-200 px-5 py-4">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-950">Storage / handover</div>
          <div className="text-sm text-slate-900 mt-1">Finder — who found or turned in the item</div>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-950">Finder — contact & ID</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-slate-950">
                  Full name <span className="text-red-600">*</span>
                </Label>
                <Input
                  value={finder.fullName}
                  onChange={(e) => setFinder({ ...finder, fullName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">Email</Label>
                <Input
                  value={finder.email}
                  onChange={(e) => setFinder({ ...finder, email: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">Phone</Label>
                <Input
                  value={finder.phone}
                  onChange={(e) => setFinder({ ...finder, phone: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">National ID</Label>
                <Input
                  value={finder.nationalId}
                  onChange={(e) => setFinder({ ...finder, nationalId: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">Student / staff ID</Label>
                <Input
                  value={finder.orgMemberId}
                  onChange={(e) => setFinder({ ...finder, orgMemberId: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-950">Handover details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <Label className="text-sm font-semibold text-slate-950">Handover time</Label>
                <Input
                  type="datetime-local"
                  value={finder.handoverTime}
                  onChange={(e) => setFinder({ ...finder, handoverTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-950">From · To</Label>
                <Input
                  value={finder.fromTo}
                  onChange={(e) => setFinder({ ...finder, fromTo: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-950">Receiving staff</Label>
                <Input
                  value={finder.receivingStaff}
                  onChange={(e) => setFinder({ ...finder, receivingStaff: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-slate-950">Notes</Label>
                <Textarea
                  value={finder.notes}
                  onChange={(e) => setFinder({ ...finder, notes: e.target.value })}
                  className="mt-1 min-h-[120px]"
                />
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
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          aria-label="Next"
          className="mb-2 h-8 w-8 rounded-full bg-slate-950 text-white hover:bg-slate-800"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5 mx-auto" />
        </Button>
      </div>
    </div>
  )
}

