import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FinderContactField } from '@/types/organization.types'

export type FinderInfo = {
  fullName: string
  email: string
  nationalId: string
  orgMemberId: string
  phone: string
}

export function Step2Finder({
  finder,
  setFinder,
  requiredFields,
  onBack,
  onNext,
}: {
  finder: FinderInfo
  setFinder: (next: FinderInfo) => void
  requiredFields: FinderContactField[] | null
  onBack: () => void
  onNext: () => void
}) {
  const required = requiredFields && requiredFields.length > 0 ? requiredFields : null
  const isRequired = (field: FinderContactField) => required?.includes(field) ?? false

  const requiredLabel = (f: FinderContactField) => {
    switch (f) {
      case 'Email':
        return 'Email'
      case 'Phone':
        return 'Phone'
      case 'NationalId':
        return 'National ID'
      case 'OrgMemberId':
        return 'Student / staff ID'
      default:
        return f
    }
  }

  return (
    <div className="space-y-4 mt-6">
      <div>
        <div className="text-xl font-bold text-slate-950">Finder information</div>
        <div className="text-xs text-slate-800 mt-1">
          Full name is required.{' '}
          {required
            ? `Required by this organization: ${required.map(requiredLabel).join(', ')}.`
            : 'Provide at least one detail: email, phone, national ID, or student/staff ID.'}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 space-y-6">
          <div>
            <div className="text-sm text-slate-900">Finder — who found or turned in the item</div>
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
                <Label className="text-sm font-semibold text-slate-950">
                  Email {isRequired('Email') ? <span className="text-red-600">*</span> : null}
                </Label>
                <Input
                  value={finder.email}
                  onChange={(e) => setFinder({ ...finder, email: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">
                  Phone {isRequired('Phone') ? <span className="text-red-600">*</span> : null}
                </Label>
                <Input
                  value={finder.phone}
                  onChange={(e) => setFinder({ ...finder, phone: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">
                  National ID {isRequired('NationalId') ? <span className="text-red-600">*</span> : null}
                </Label>
                <Input
                  value={finder.nationalId}
                  onChange={(e) => setFinder({ ...finder, nationalId: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-950">
                  Student / staff ID {isRequired('OrgMemberId') ? <span className="text-red-600">*</span> : null}
                </Label>
                <Input
                  value={finder.orgMemberId}
                  onChange={(e) => setFinder({ ...finder, orgMemberId: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          aria-label="Back"
          className="mb-2 h-8 w-8 rounded-full bg-slate-950 text-white hover:bg-slate-800"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5 mx-auto" />
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

