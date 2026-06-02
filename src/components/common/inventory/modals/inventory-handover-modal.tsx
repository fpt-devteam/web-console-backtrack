import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/common/core/button'
import { Input } from '@/components/common/core/input'
import { Label } from '@/components/common/core/label'
import { useCreateOrgReturnReport } from '@/hooks/use-return-report'
import { useUser } from '@/hooks/use-user'
import { showToast } from '@/lib/toast'
import { AdminModal } from '@/components/console/admin/admin-modal'
import { useOrganization } from '@/hooks/use-org'
import type { FinderContactField } from '@/types/organization.types'
import { InventoryPhotosPicker } from '../photos/inventory-photos-picker'
import { collectInventoryImageUrls, reorderList, revokeObjectUrls, type InventoryPhotoPreview } from '@/utils/inventory-photos'
import { uploadInventoryImage } from '@/services/storage.service'
import { isValidEmail, isValidPhone10StartingWith0 } from '@/utils/validators'
import { useChatConversationsByPostId, useClosePostConversations } from '@/hooks/use-chat'
import { ConversationStatus } from '@/types/chat.types'
import type { IConversation } from '@/types/chat.types'
import { STATUS_BADGE, STATUS_LABEL } from '@/components/common/claim/claim.constants'
import { formatClaimId } from '@/components/common/claim/claim.utils'
import { Avatar } from '@/components/common/avatar'
import { cn } from '@/lib/utils'

export function HandoverItemModal({
  open,
  title = 'Handover',
  orgId,
  postId,
  onClose,
  onSuccess,
}: {
  open: boolean
  title?: string
  orgId: string | null
  postId: string
  onClose: () => void
  onSuccess?: () => void
}) {
  const createReturnReport = useCreateOrgReturnReport()
  const closeClaims = useClosePostConversations()
  const { data: me } = useUser()
  const { data: org } = useOrganization(orgId)

  const [recipientFullName, setRecipientFullName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientNationalId, setRecipientNationalId] = useState('')
  const [recipientInternalId, setRecipientInternalId] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [claimRequestId, setClaimRequestId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Verified claim requests linked to this item — staff can attach one to the handover.
  const claimsQuery = useChatConversationsByPostId(open ? postId : null, orgId ?? undefined)
  const verifiedClaims = (claimsQuery.data ?? []).filter((c) => c.status === ConversationStatus.VERIFIED)

  // Selecting a verified claim prefills the recipient with the claimant's details.
  function handleSelectClaim(conv: IConversation) {
    if (claimRequestId === conv.id) {
      setClaimRequestId(null)
      return
    }
    setClaimRequestId(conv.id)
    const form = conv.supportFormData
    setRecipientFullName(conv.partner.displayName ?? form?.contactName ?? '')
    setRecipientEmail(conv.partner.email ?? form?.contactEmail ?? '')
    setRecipientPhone(form?.contactPhone ?? '')
  }

  const MAX_EVIDENCE_PHOTOS = 4
  const [evidencePreviews, setEvidencePreviews] = useState<InventoryPhotoPreview[]>([])
  const evidencePreviewsRef = useRef<InventoryPhotoPreview[]>([])
  const uploadedUrlByFileKeyRef = useRef<Map<string, string>>(new Map())

  const staffName = me?.name ?? me?.displayName ?? me?.email ?? '—'

  const requiredOwnerFields: FinderContactField[] = org?.requiredOwnerContractFields ?? ['Phone']
  const isRequired = (f: FinderContactField) => requiredOwnerFields.includes(f)

  const validateRequired = () => {
    if (evidencePreviews.length === 0) return 'Please upload at least 1 evidence photo.'
    if (recipientEmail.trim() && !isValidEmail(recipientEmail)) return 'Please enter a valid recipient email.'
    if (recipientPhone.trim() && !isValidPhone10StartingWith0(recipientPhone)) {
      return 'Recipient phone number must start with 0 and contain exactly 10 digits.'
    }
    if (isRequired('Email') && !recipientEmail.trim()) return 'Email is required.'
    if (isRequired('Phone') && !recipientPhone.trim()) return 'Phone number is required.'
    if (isRequired('NationalId') && !recipientNationalId.trim()) return 'National ID / citizen ID is required.'
    if (isRequired('OrgMemberId') && !recipientInternalId.trim()) return 'Student / staff ID is required.'
    return null
  }

  useEffect(() => {
    evidencePreviewsRef.current = evidencePreviews
  }, [evidencePreviews])

  useEffect(() => {
    return () => {
      revokeObjectUrls(evidencePreviewsRef.current)
    }
  }, [])

  const handlePickEvidencePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remaining = MAX_EVIDENCE_PHOTOS - evidencePreviews.length
    if (remaining <= 0) return

    const next = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({ file, url: URL.createObjectURL(file), isExisting: false }))

    setEvidencePreviews((prev) => [...prev, ...next])
    e.target.value = ''
  }

  const removeEvidencePhoto = (index: number) => {
    setEvidencePreviews((prev) => {
      const target = prev[index]
      if (target && !target.isExisting) {
        try {
          URL.revokeObjectURL(target.url)
        } catch {
          // ignore
        }
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  return (
    <AdminModal open={open} title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (submitting || createReturnReport.isPending) return
          if (!orgId) {
            showToast.error('No active organization')
            return
          }

          const validationError = validateRequired()
          if (validationError) {
            showToast.error(validationError)
            return
          }

          ;(async () => {
            try {
              setSubmitting(true)
              const evidenceImageUrls = await collectInventoryImageUrls({
                previews: evidencePreviews,
                cacheByFileKey: uploadedUrlByFileKeyRef.current,
                upload: (file) => uploadInventoryImage(orgId, file),
              })

              createReturnReport.mutate(
                {
                  orgId,
                  postId,
                  evidenceImageUrls,
                  claimRequestId,
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
                    // Resolve the selected (verified) claim and reject the rest.
                    // Invalidates all claim + inventory caches on success.
                    closeClaims.mutate({ postId, exceptId: claimRequestId })
                    showToast.success('Handover saved')
                    setSubmitting(false)
                    onClose()
                    onSuccess?.()
                  },
                  onError: (err) => {
                    showToast.error(err instanceof Error ? err.message : 'Failed to save handover')
                    setSubmitting(false)
                  },
                },
              )
            } catch (err) {
              showToast.error(err instanceof Error ? err.message : 'Failed to upload evidence photos')
              setSubmitting(false)
            }
          })()
        }}
      >
        {verifiedClaims.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-[#222222]">LINKED CLAIM REQUEST</div>
            <p className="text-xs text-[#929292] -mt-1">
              Attach the verified claim this item is being handed over for. Selecting one fills the recipient details.
            </p>
            <div className="flex flex-col gap-2">
              {verifiedClaims.map((conv) => {
                const name = conv.partner.displayName ?? conv.partner.email ?? conv.id.slice(0, 8)
                const selected = claimRequestId === conv.id
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectClaim(conv)}
                    aria-pressed={selected}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all hover:cursor-pointer',
                      selected ? 'border-rose-500 ring-2 ring-rose-200' : 'border-[#ebebeb] hover:border-neutral-300',
                    )}
                  >
                    <Avatar url={conv.partner.avatarUrl} name={name} className="w-9 h-9 rounded-full shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#929292]">{formatClaimId(conv.id)}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[conv.status]}`}>
                          {STATUS_LABEL[conv.status]}
                        </span>
                      </div>
                      <p className="truncate text-sm font-medium text-[#222222]">{name}</p>
                      <p className="truncate text-xs text-[#929292]">{conv.supportFormData?.itemName}</p>
                    </div>
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                        selected ? 'border-rose-500 bg-rose-500' : 'border-neutral-300',
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#222222]">
            EVIDENCE PHOTOS <span className="text-[#c13515]">*</span>
          </div>
        </div>

        <InventoryPhotosPicker
          photoPreviews={evidencePreviews}
          maxPhotos={MAX_EVIDENCE_PHOTOS}
          onPickPhotos={handlePickEvidencePhotos}
          onRemovePhoto={removeEvidencePhoto}
          onReorderPhotos={(from, to) => setEvidencePreviews((prev) => reorderList(prev, from, to))}
          isAnalyzing={false}
          onAnalyze={() => {}}
          showAnalyze={false}
          required
        />

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
              placeholder="Morgan Lee"
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
              placeholder="079092******441"
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
              placeholder="STF-88012"
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
            placeholder="+1 415 000 9021"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            className="mt-1 h-8 text-xs"
          />
        </div>

        <div className="pt-2 border-t border-[#ebebeb]">
          <div className="text-sm font-semibold text-[#222222] mb-3">STAFF</div>
          <div>
            <Input value={staffName} readOnly className=" h-8 text-xs bg-[#f7f7f7]" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebebeb]">
          <Button type="button" variant="outline" size="sm" disabled={submitting || createReturnReport.isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-[#ff385c] hover:bg-[#e0324f]"
            disabled={submitting || createReturnReport.isPending}
          >
            {submitting || createReturnReport.isPending ? 'Saving…' : 'Handover'}
          </Button>
        </div>
      </form>
    </AdminModal>
  )
}
