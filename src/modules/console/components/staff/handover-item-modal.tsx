import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateOrgReturnReport } from '@/hooks/use-return-report'
import { useUser } from '@/hooks/use-user'
import { showToast } from '@/lib/toast'
import { AdminModal } from '@/modules/console/components/admin/AdminModal'
import { useOrganization } from '@/hooks/use-org'
import type { FinderContactField } from '@/types/organization.types'

export function HandoverItemModal({
  open,
  title = 'Handover',
  orgId,
  postId,
  onClose,
}: {
  open: boolean
  title?: string
  orgId: string | null
  postId: string
  onClose: () => void
}) {
  const createReturnReport = useCreateOrgReturnReport()
  const { data: me } = useUser()
  const { data: org } = useOrganization(orgId)

  const [recipientFullName, setRecipientFullName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientNationalId, setRecipientNationalId] = useState('')
  const [recipientInternalId, setRecipientInternalId] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')

  const staffName = me?.name ?? me?.displayName ?? me?.email ?? '—'
  const staffId = me?.id ?? '—'

  const requiredOwnerFields: FinderContactField[] = org?.requiredOwnerContractFields ?? ['Phone']
  const isRequired = (f: FinderContactField) => requiredOwnerFields.includes(f)

  const validateRequired = () => {
    if (isRequired('Email') && !recipientEmail.trim()) return 'Email is required.'
    if (isRequired('Phone') && !recipientPhone.trim()) return 'Phone number is required.'
    if (isRequired('NationalId') && !recipientNationalId.trim()) return 'National ID / citizen ID is required.'
    if (isRequired('OrgMemberId') && !recipientInternalId.trim()) return 'Student / staff ID is required.'
    return null
  }

  return (
    <AdminModal open={open} title={title} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!orgId) {
            showToast.error('No active organization')
            return
          }

          const validationError = validateRequired()
          if (validationError) {
            showToast.error(validationError)
            return
          }

          createReturnReport.mutate(
            {
              orgId,
              postId,
              ownerInfo: {
                ownerName: recipientFullName.trim() || null,
                email: recipientEmail.trim() || null,
                phone: recipientPhone.trim() || null,
                nationalId: recipientNationalId.trim() || null,
                orgMemberId: recipientInternalId.trim() || null,
              },
            },
            {
              onSuccess: () => {
                showToast.success('Handover saved')
                onClose()
              },
              onError: (err) => {
                showToast.error(err instanceof Error ? err.message : 'Failed to save handover')
              },
            },
          )
        }}
      >
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#222222]">RECIPIENT INFORMATION</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipientFullName" className="text-sm font-medium text-[#222222]">
              Full name
            </Label>
            <Input
              id="recipientFullName"
              type="text"
              placeholder="e.g. Morgan Lee"
              value={recipientFullName}
              onChange={(e) => setRecipientFullName(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="recipientEmail" className="text-sm font-medium text-[#222222]">
              Email {isRequired('Email') ? <span className="text-[#c13515]">*</span> : null}
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="name@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="recipientNationalId" className="text-sm font-medium text-[#222222]">
              National ID / citizen ID {isRequired('NationalId') ? <span className="text-[#c13515]">*</span> : null}
            </Label>
            <Input
              id="recipientNationalId"
              type="text"
              placeholder="e.g. 079092******441"
              value={recipientNationalId}
              onChange={(e) => setRecipientNationalId(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="recipientInternalId" className="text-sm font-medium text-[#222222]">
              Student / staff ID {isRequired('OrgMemberId') ? <span className="text-[#c13515]">*</span> : null}
            </Label>
            <Input
              id="recipientInternalId"
              type="text"
              placeholder="e.g. STF-88012"
              value={recipientInternalId}
              onChange={(e) => setRecipientInternalId(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="recipientPhone" className="text-sm font-medium text-[#222222]">
            Phone number {isRequired('Phone') ? <span className="text-[#c13515]">*</span> : null}
          </Label>
          <Input
            id="recipientPhone"
            type="tel"
            placeholder="e.g. +1 415 000 9021"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            className="mt-1 h-8 text-xs"
          />
        </div>

        <div className="pt-2 border-t border-[#ebebeb]">
          <div className="text-sm font-semibold text-[#222222] mb-3">STAFF</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#222222]">Name</Label>
              <Input value={staffName} readOnly className="mt-1 h-8 text-xs bg-[#f7f7f7]" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#222222]">ID</Label>
              <Input value={staffId} readOnly className="mt-1 h-8 text-xs bg-[#f7f7f7]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebebeb]">
          <Button type="button" variant="outline" size="sm" disabled={createReturnReport.isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="bg-[#ff385c] hover:bg-[#e0324f]" disabled={createReturnReport.isPending}>
            {createReturnReport.isPending ? 'Saving…' : 'Handover'}
          </Button>
        </div>
      </form>
    </AdminModal>
  )
}

