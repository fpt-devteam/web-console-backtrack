import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronRight, Camera } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryItem } from '@/services/inventory.service'
import { inventoryStatusLabel, inventoryStatusPillClass } from './status'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'
import { InventoryDetailAttributeGrid } from './inventory-detail-attribute-grid'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#ebebeb] py-3 last:border-0 sm:grid sm:grid-cols-2 sm:items-baseline sm:gap-4 sm:py-2">
      <div className="text-xs text-[#6a6a6a] sm:text-sm">{label}</div>
      <div className="text-sm text-[#222222] break-words sm:text-right">{value}</div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-3 first:pt-0">
      <div className="text-sm font-semibold tracking-wide text-[#222222] uppercase">{title}</div>
    </div>
  )
}

function formatOrDash(v: string | null | undefined) {
  return v?.trim() ? v.trim() : '—'
}

function formatDateTimeOrDash(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

function StepperDot({
  state,
  label,
  date,
  showDate = true,
  disabled = false,
  onClick,
}: {
  state: 'done' | 'active' | 'todo'
  label: string
  date: string
  showDate?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  const dotClass =
    state === 'active'
      ? 'bg-[#ff385c] ring-4 ring-[#fff0f2] scale-[1.225]'
      : state === 'done'
        ? 'bg-[#ff385c]'
        : 'bg-[#dddddd]'

  const textClass = state === 'active' ? 'text-[#222222]' : state === 'done' ? 'text-[#222222]' : 'text-[#929292]'

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'group flex flex-col items-center gap-1 min-w-0',
        disabled ? 'cursor-default' : 'cursor-pointer',
      ].join(' ')}
      aria-current={state === 'active' ? 'step' : undefined}
    >
      <span className={`h-3 w-3 rounded-full transition-all duration-200 ${dotClass}`} />
      <span className={`text-xs font-semibold whitespace-nowrap ${textClass}`}>{label}</span>
      {showDate ? <span className="text-[11px] text-[#929292] whitespace-nowrap">{date}</span> : null}
    </button>
  )
}

export function InventoryItemDetailView({
  backTo,
  isLoading,
  item,
  mainImageIndex,
  onMainImageIndexChange,
  actions,
  extra,
  showAddThumbnailButton = false,
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
  showAddThumbnailButton?: boolean
  returnReportForPost: any
  subcategoryNameById?: Record<string, string>
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#222222] mb-2">Item Not Found</h2>
          <p className="text-[#6a6a6a] mb-6">The item you're looking for doesn't exist.</p>
          <Link to={backTo.to} params={backTo.params}>
            <button className="inline-flex items-center justify-center rounded-[8px] bg-[#ff385c] px-4 py-2 text-sm font-medium text-white hover:bg-[#e0324f]">
              Back to Inventory
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const images = item.imageUrls?.length ? item.imageUrls : []
  const mainImg = images[mainImageIndex] ?? images[0]
  const title = getInventoryTitle(item, subcategoryNameById)
  const subName = getInventorySubcategoryName(item, subcategoryNameById)
  const headerPrimary = title.trim() || subName.trim() || 'Inventory item'
  const imgAlt = title.trim() || subName.trim() || 'Inventory item'

  const [activeStep, setActiveStep] = useState<number>(0)

  useEffect(() => {
    setActiveStep(0)
  }, [item.id])

  const progressStep = useMemo(() => {
    if (item.status === 'Returned' || item.status === 'Archived' || item.status === 'Expired') return 2
    if (item.status === 'InStorage') return 1
    return 0
  }, [item.status])

  const addedAt = useMemo(() => {
    return new Date(item.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }, [item.createdAt])

  const intakeAt = useMemo(() => formatDateTimeOrDash(item.createdAt), [item.createdAt])
  const handoverAt = useMemo(() => formatDateTimeOrDash(returnReportForPost?.createdAt), [returnReportForPost?.createdAt])
  const terminalAt = useMemo(
    () => formatDateTimeOrDash((item as any).updatedAt ?? item.createdAt),
    [item],
  )

  const isTerminal = item.status === 'Archived' || item.status === 'Expired'
  const isHandoverDone = item.status === 'Returned'
  const step3Label = isHandoverDone ? 'Handover' : isTerminal ? inventoryStatusLabel(item.status) : 'Handover'
  const step3Date = isHandoverDone ? handoverAt : isTerminal ? terminalAt : '—'

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-6 lg:mx-auto lg:max-w-[1600px] lg:px-8">
      <div className="mb-4 flex min-w-0 items-center gap-1.5 text-xs text-[#6a6a6a] sm:mb-6 sm:gap-2">
        <Link to={backTo.to} params={backTo.params} className="shrink-0 hover:text-[#222222] transition-colors">
          Inventory
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="min-w-0 truncate font-medium text-[#222222]" title={headerPrimary}>
          {headerPrimary}
        </span>
      </div>

      {/* Title outside the card */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <h1 className="text-xl font-bold text-[#222222] sm:text-2xl">{title}</h1>
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase sm:px-3 sm:text-xs ${inventoryStatusPillClass(item.status)}`}
            >
              {inventoryStatusLabel(item.status)}
            </span>
          </div>
          <p className="text-xs text-[#6a6a6a]">Added {addedAt}</p>
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end [&>button]:min-h-10 [&>button]:flex-1 sm:[&>button]:min-h-9 sm:[&>button]:flex-none">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="rounded-[14px] border border-[#dddddd] bg-white">
        <div className="border-b border-[#ebebeb] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
            <div className="min-w-0 shrink-0">
              <div className="text-xs font-semibold text-[#6a6a6a]">Progress</div>
              <div className="text-[11px] text-[#929292]">Status timeline (tap to view details)</div>
            </div>
            <div className="-mx-1 w-full min-w-0 overflow-x-auto overflow-y-hidden px-1 pb-1 lg:mx-0 lg:w-auto lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e8e8e8]">
              <div className="flex min-w-max items-center justify-center gap-2 px-1 sm:gap-3 md:gap-6 lg:justify-end">
                <StepperDot
                  state={activeStep === 0 ? 'active' : progressStep >= 0 ? 'done' : 'todo'}
                  label="Detail"
                  date={addedAt}
                  showDate={false}
                  disabled={isTerminal}
                  onClick={() => setActiveStep(0)}
                />
                <div className={`h-px w-8 shrink-0 sm:w-10 md:w-14 ${progressStep >= 1 ? 'bg-[#ff385c]' : 'bg-[#dddddd]'}`} />
                <StepperDot
                  state={activeStep === 1 ? 'active' : progressStep >= 1 ? 'done' : 'todo'}
                  label="In Storage"
                  date={intakeAt}
                  disabled={isTerminal}
                  onClick={() => setActiveStep(1)}
                />
                <div className={`h-px w-8 shrink-0 sm:w-10 md:w-14 ${progressStep >= 2 ? 'bg-[#ff385c]' : 'bg-[#dddddd]'}`} />
                <StepperDot
                  state={activeStep === 2 ? 'active' : progressStep >= 2 ? 'done' : 'todo'}
                  label={step3Label}
                  date={step3Date}
                  disabled={isTerminal || !isHandoverDone}
                  onClick={() => setActiveStep(2)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7">
          <div className="border-b border-[#ebebeb] p-4 sm:p-6 lg:col-span-3 lg:border-r lg:border-b-0">
            <div className="relative mb-4 flex h-[min(280px,52vw)] max-h-[360px] min-h-[200px] items-center justify-center overflow-hidden rounded-[8px] bg-[#f7f7f7] sm:h-[min(320px,45vh)] lg:h-[350px] lg:max-h-none">
              {mainImg ? (
                <img src={mainImg} alt={imgAlt} className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="text-[#929292]">No image</div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:gap-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e0e0e0]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onMainImageIndexChange(idx)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border-2 transition-all sm:h-20 sm:w-20 ${
                      mainImageIndex === idx ? 'border-[#ff385c] ring-2 ring-[#fff0f2]' : 'border-[#dddddd] hover:border-[#b0b0b0]'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
                  </button>
                ))}
                {showAddThumbnailButton ? (
                  <button
                    type="button"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] border-2 border-dashed border-[#dddddd] text-[#929292] sm:h-20 sm:w-20"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-6 px-4 py-5 text-sm sm:px-6 lg:col-span-4 lg:px-8 lg:py-6">
            {activeStep === 0 ? (
              <InventoryDetailAttributeGrid
                item={item}
                subcategoryNameById={subcategoryNameById}
                orgSlug={item.organization?.slug}
              />
            ) : null}
            {activeStep === 1 ? (
              <div className="space-y-5">
                <SectionTitle title="Finder — contact & ID" />
                <div className="mt-2">
                  <DetailRow label="Full name" value={formatOrDash(item.finderInfo?.finderName)} />
                  <DetailRow label="Email" value={formatOrDash(item.finderInfo?.email)} />
                </div>

                <SectionTitle title="Finder — identification" />
                <div className="mt-2">
                  <DetailRow label="National ID / citizen ID" value={formatOrDash(item.finderInfo?.nationalId)} />
                  <DetailRow label="Student / staff ID" value={formatOrDash(item.finderInfo?.orgMemberId)} />
                  <DetailRow label="Phone number" value={formatOrDash(item.finderInfo?.phone)} />
                </div>

                <SectionTitle title="Intake" />
                <div className="mt-2">
                  <DetailRow label="Created at" value={formatDateTimeOrDash(item.createdAt)} />
                  <DetailRow label="Receiving staff" value={formatOrDash(item.author?.displayName)} />
                </div>
              </div>
            ) : null}

            {activeStep === 2 && isHandoverDone ? (
              <div className="space-y-5">
                {item.status === 'Returned' ? (
                  <>
                    <SectionTitle title="Recipient — contact & ID" />
                    <div className="mt-2">
                      <DetailRow label="Full name" value={formatOrDash(returnReportForPost?.ownerInfo?.ownerName)} />
                      <DetailRow label="Email" value={formatOrDash(returnReportForPost?.ownerInfo?.email)} />
                    </div>

                    <SectionTitle title="Recipient — identification" />
                    <div className="mt-2">
                      <DetailRow label="National ID / citizen ID" value={formatOrDash(returnReportForPost?.ownerInfo?.nationalId)} />
                      <DetailRow label="Student / staff ID" value={formatOrDash(returnReportForPost?.ownerInfo?.orgMemberId)} />
                      <DetailRow label="Phone number" value={formatOrDash(returnReportForPost?.ownerInfo?.phone)} />
                    </div>

                    <SectionTitle title="Return release" />
                    <div className="mt-2">
                      <DetailRow label="Created at" value={formatDateTimeOrDash(returnReportForPost?.createdAt)} />
                      <DetailRow label="Releasing staff" value={formatOrDash(returnReportForPost?.staff?.displayName)} />
                    </div>

                    {(returnReportForPost?.evidenceImageUrls?.length ?? 0) > 0 ? (
                      <>
                        <SectionTitle title="Evidence photos" />
                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {(returnReportForPost.evidenceImageUrls ?? []).map((url: string, idx: number) => (
                            <a
                              key={`${url}:${idx}`}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-[10px] overflow-hidden border border-[#dddddd] hover:border-[#b0b0b0] transition-colors"
                              title="Open image"
                            >
                              <img
                                src={url}
                                alt={`Evidence ${idx + 1}`}
                                className="w-full h-28 object-contain bg-white"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <SectionTitle title="Status update" />
                    <div className="mt-2">
                      <DetailRow label="Status" value={inventoryStatusLabel(item.status)} />
                      <DetailRow label="Updated at" value={terminalAt} />
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {extra}
    </div>
  )
}
