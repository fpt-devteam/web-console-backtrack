import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ImageOff } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/common/core/spinner'
import type { InventoryItem } from '@/services/inventory.service'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'
import { useChatConversationsByPostId } from '@/hooks/use-chat'
import { formatDateTimeOrDash } from './inventory-detail-format'
import { InventoryDetailHeader } from './inventory-detail-header'
import { InventoryDetailModeTabs } from './inventory-detail-mode-tabs'
import { InventoryProgressStepper } from './inventory-progress-stepper'
import { InventoryFinderCard } from './inventory-finder-card'
import { InventoryLoggedByCard } from './inventory-logged-by-card'
import { InventoryStorageStep } from './steps/inventory-storage-step'
import { InventoryClaimRequest } from './steps/inventory-claim-request'
import { InventoryReturnedStep } from './steps/inventory-returned-step'
import { InventoryStatusUpdateStep } from './steps/inventory-status-update-step'

export function InventoryItemDetailView({
  backTo,
  isLoading,
  item,
  mainImageIndex,
  onMainImageIndexChange,
  actions,
  extra,
  returnReportForPost,
  subcategoryNameById,
}: {
  slug: string
  itemId: string
  backTo: { to: string; params: Record<string, string> }
  isLoading: boolean
  item: InventoryItem | null | undefined
  mainImageIndex: number
  onMainImageIndexChange: (idx: number) => void
  actions?: ReactNode
  extra?: ReactNode
  returnReportForPost: any
  subcategoryNameById?: Record<string, string>
}) {
  // 0: In Storage | 2: Returned | 3: Archived | 4: Expired
  const [activeStep, setActiveStep] = useState<number>(0)
  const [mode, setMode] = useState<'overview' | 'claims'>('overview')

  useEffect(() => {
    if (!item) return
    if (item.status === 'Returned') setActiveStep(2)
    else if (item.status === 'Archived') setActiveStep(3)
    else if (item.status === 'Expired') setActiveStep(4)
    else setActiveStep(0)
  }, [item?.id, item?.status])

  const intakeAt = useMemo(() => formatDateTimeOrDash(item?.createdAt), [item?.createdAt])
  const terminalAt = useMemo(
    () => formatDateTimeOrDash((item as any)?.updatedAt ?? item?.createdAt),
    [item],
  )

  const relatedConvsQuery = useChatConversationsByPostId(item?.id ?? '', item?.organization?.id ?? undefined)
  const relatedConvs = relatedConvsQuery.data ?? []

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <ImageOff className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="mb-1 text-xl font-bold text-gray-900">Item Not Found</h2>
          <p className="mb-6 text-sm text-gray-500">The item you're looking for doesn't exist.</p>
          <Link to={backTo.to} params={backTo.params}>
            <button className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors">
              Back to Inventory
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const images = item.imageUrls.length ? item.imageUrls : []
  const title = getInventoryTitle(item, subcategoryNameById)
  const subName = getInventorySubcategoryName(item, subcategoryNameById)
  const imgAlt = title.trim() || subName.trim() || 'Inventory item'

  const modes = [
    { name: 'Overview', active: mode === 'overview', onSelect: () => setMode('overview') },
    {
      name: 'Claims',
      badge: relatedConvs.length,
      active: mode === 'claims',
      onSelect: () => setMode('claims'),
    },
  ]

  return (
    <div className="mx-auto h-full w-full overflow-y-auto">
      <div className="sticky top-0 z-20 bg-white">
        <InventoryDetailHeader
          backTo={backTo}
          itemId={item.id}
          itemName={item.postTitle}
          status={item.status}
          actions={actions}
        />

        <InventoryDetailModeTabs modes={modes} className="px-4 py-3" />
      </div>

      {/* Main card */}
      {mode === 'overview' && (
        <div className='px-4 py-2'>
          <div className="overflow-hidden bg-white">

            {/* Body */}
            <div className="grid grid-cols-10">

              {/* Left column — finder, logging staff & progress */}
              <div className="flex flex-col gap-y-6 col-span-3">
                <InventoryFinderCard item={item} />
                <InventoryLoggedByCard item={item} />
                <InventoryProgressStepper
                  status={item.status}
                  activeStep={activeStep}
                  onStepChange={setActiveStep}
                  intakeAt={intakeAt}
                  terminalAt={terminalAt}
                  returnedDate={formatDateTimeOrDash(returnReportForPost?.createdAt)}
                />
              </div>

              {/* Right column — full item info, QR & step content */}
              <div className="px-4 col-span-7">
                {activeStep === 0 && (
                  <InventoryStorageStep
                    item={item}
                    images={images}
                    imgAlt={imgAlt}
                    mainImageIndex={mainImageIndex}
                    onMainImageIndexChange={onMainImageIndexChange}
                    subcategoryNameById={subcategoryNameById}
                  />
                )}

                {activeStep === 2 && (
                  <InventoryReturnedStep returnReportForPost={returnReportForPost} orgId={item.organization?.id} />
                )}

                {activeStep === 3 && (
                  <InventoryStatusUpdateStep
                    variant="archived"
                    terminalAt={terminalAt}
                    staffName={returnReportForPost?.staff?.displayName}
                  />
                )}

                {activeStep === 4 && (
                  <InventoryStatusUpdateStep
                    variant="expired"
                    terminalAt={terminalAt}
                    staffName={returnReportForPost?.staff?.displayName}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claims mode — claim requests for this item */}
      {mode === 'claims' && (
        <div className='px-4 py-2'>
          <InventoryClaimRequest
            item={item}
            images={images}
            imgAlt={imgAlt}
            mainImageIndex={mainImageIndex}
            onMainImageIndexChange={onMainImageIndexChange}
            subcategoryNameById={subcategoryNameById}
          />
        </div>
      )}
      {extra}
    </div>
  )
}
