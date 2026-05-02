import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateOrgReturnReport } from '@/hooks/use-return-report'
import { useUser } from '@/hooks/use-user'
import { showToast } from '@/lib/toast'
import { AdminModal } from '@/modules/console/components/admin/AdminModal'
import { useOrganization } from '@/hooks/use-org'
import type { FinderContactField } from '@/types/organization.types'
import { InventoryPhotosPicker } from '@/modules/console/components/inventory/inventory-photos-picker'
import { collectInventoryImageUrls, reorderList, revokeObjectUrls, type InventoryPhotoPreview } from '@/utils/inventory-photos'
import { uploadInventoryImage } from '@/services/storage.service'

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

  const MAX_EVIDENCE_PHOTOS = 4
  const [evidencePreviews, setEvidencePreviews] = useState<InventoryPhotoPreview[]>([])
  const evidencePreviewsRef = useRef<InventoryPhotoPreview[]>([])
  const uploadedUrlByFileKeyRef = useRef<Map<string, string>>(new Map())

  const staffName = me?.name ?? me?.displayName ?? me?.email ?? '—'

  const requiredOwnerFields: FinderContactField[] = org?.requiredOwnerContractFields ?? ['Phone']
  const isRequired = (f: FinderContactField) => requiredOwnerFields.includes(f)

  const validateRequired = () => {
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
            } catch (err) {
              showToast.error(err instanceof Error ? err.message : 'Failed to upload evidence photos')
            }
          })()
        }}
      >
        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#222222]">EVIDENCE PHOTOS</div>
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

