import { AdminModal } from '@/modules/console/components/admin/AdminModal'
import { Button } from '@/components/ui/button'

export function ArchiveConfirmModal({
  open,
  isPending,
  onConfirm,
  onClose,
}: {
  open: boolean
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <AdminModal open={open} title="Archive item" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-[#444444]">
          Are you sure you want to archive this item? It will be marked as{' '}
          <span className="font-semibold text-[#222222]">Archived</span> and removed from the active
          inventory list.
        </p>

        <div className="flex justify-end gap-3 pt-2 border-t border-[#ebebeb]">
          <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-[#c13515] hover:bg-[#a02d10] text-white"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Archiving…' : 'Archive'}
          </Button>
        </div>
      </div>
    </AdminModal>
  )
}
