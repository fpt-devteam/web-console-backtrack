import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Check, ChevronRight, Camera, ImageOff } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryItem } from '@/services/inventory.service'
import { inventoryStatusLabel, inventoryStatusPillClass } from './status'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'
import { InventoryDetailAttributeGrid } from './inventory-detail-attribute-grid'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_1.4fr] items-start gap-3 border-b border-gray-100 py-2.5 last:border-0 sm:grid-cols-[180px_1fr]">
      <dt className="text-xs font-medium text-gray-500 pt-0.5">{label}</dt>
      <dd className="text-sm font-semibold text-gray-800 break-words text-right">{value}</dd>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-1">
      <div className="h-4 w-1 rounded-full bg-rose-400 shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</span>
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
  const isDone = state === 'done'
  const isActive = state === 'active'

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={['group flex flex-col items-center gap-1.5 min-w-0', disabled ? 'cursor-default' : 'cursor-pointer'].join(' ')}
      aria-current={isActive ? 'step' : undefined}
    >
      <span className={`
        flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0
        ${isActive ? 'border-rose-500 bg-rose-50 ring-4 ring-rose-100 scale-110' :
          isDone  ? 'border-rose-500 bg-rose-500' :
                    'border-gray-200 bg-white'}
      `}>
        {isActive
          ? <span className="w-3 h-3 rounded-full bg-rose-500" />
          : isDone
            ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
            : <span className="w-2 h-2 rounded-full bg-gray-300" />}
      </span>
      <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-rose-600' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </span>
      {showDate && <span className="text-[11px] text-gray-400 whitespace-nowrap">{date}</span>}
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
  defaultActiveStep = 0,
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
  defaultActiveStep?: number
}) {
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
  const mainImg = images[mainImageIndex] ?? images[0]
  const title = getInventoryTitle(item, subcategoryNameById)
  const subName = getInventorySubcategoryName(item, subcategoryNameById)
  const headerPrimary = title.trim() || subName.trim() || 'Inventory item'
  const imgAlt = title.trim() || subName.trim() || 'Inventory item'

  const [activeStep, setActiveStep] = useState<number>(0)

  useEffect(() => {
    setActiveStep(defaultActiveStep)
  }, [item.id, defaultActiveStep])

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
    <div className="mx-auto h-full w-full overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-24">

      {/* Breadcrumb */}
      <div className="mb-5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400">
        <Link to={backTo.to} params={backTo.params} className="shrink-0 font-medium hover:text-gray-700 transition-colors">
          Inventory
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 truncate font-semibold text-gray-700" title={headerPrimary}>
          {headerPrimary}
        </span>
      </div>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${inventoryStatusPillClass(item.status)}`}>
              {inventoryStatusLabel(item.status)}
            </span>
          </div>
        </div>
        {actions && (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end [&>button]:min-h-10 [&>button]:flex-1 sm:[&>button]:min-h-9 sm:[&>button]:flex-none">
            {actions}
          </div>
        )}
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Progress stepper */}
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Progress</p>
              <p className="text-xs text-gray-400">Status timeline · tap to view details</p>
            </div>
            <div className="-mx-1 overflow-x-auto overflow-y-hidden px-1 pb-1 lg:mx-0 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
              <div className="flex min-w-max items-center gap-2 px-1 sm:gap-3 md:gap-5 lg:justify-end">
                <StepperDot
                  state={activeStep === 0 ? 'active' : progressStep >= 0 ? 'done' : 'todo'}
                  label="Detail"
                  date={addedAt}
                  showDate={false}
                  onClick={() => setActiveStep(0)}
                />
                <div className={`h-0.5 w-10 shrink-0 rounded-full sm:w-14 md:w-20 transition-colors ${progressStep >= 1 ? 'bg-rose-400' : 'bg-gray-200'}`} />
                <StepperDot
                  state={activeStep === 1 ? 'active' : progressStep >= 1 ? 'done' : 'todo'}
                  label="In Storage"
                  date={intakeAt}
                  onClick={() => setActiveStep(1)}
                />
                <div className={`h-0.5 w-10 shrink-0 rounded-full sm:w-14 md:w-20 transition-colors ${progressStep >= 2 ? 'bg-rose-400' : 'bg-gray-200'}`} />
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

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-7">

          {/* Image panel */}
          <div className="border-b border-gray-100 p-4 sm:p-6 lg:col-span-3 lg:border-r lg:border-b-0">
            <div className="relative mb-4 flex h-[min(280px,52vw)] max-h-[380px] min-h-[200px] items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-[min(320px,45vh)] lg:h-[360px] lg:max-h-none">
              {mainImg ? (
                <img src={mainImg} alt={imgAlt} className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <ImageOff className="w-12 h-12" strokeWidth={1} />
                  <span className="text-xs font-medium">No image</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:gap-2.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onMainImageIndexChange(idx)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                      mainImageIndex === idx
                        ? 'border-rose-500 ring-2 ring-rose-100'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
                  </button>
                ))}
                {showAddThumbnailButton && (
                  <button
                    type="button"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors sm:h-20 sm:w-20"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="px-5 py-5 sm:px-6 sm:py-6 lg:col-span-4 lg:px-8 lg:py-6">
            {activeStep === 0 && (
              <InventoryDetailAttributeGrid
                item={item}
                subcategoryNameById={subcategoryNameById}
                orgSlug={item.organization?.slug}
              />
            )}

            {activeStep === 1 && (
              <div className="space-y-5">
                <SectionTitle title="Finder — contact & ID" />
                <div className="rounded-xl bg-gray-50 px-4">
                  <DetailRow label="Full name" value={formatOrDash(item.finderInfo?.finderName)} />
                  <DetailRow label="Email" value={formatOrDash(item.finderInfo?.email)} />
                </div>

                <SectionTitle title="Finder — identification" />
                <div className="rounded-xl bg-gray-50 px-4">
                  <DetailRow label="National ID / citizen ID" value={formatOrDash(item.finderInfo?.nationalId)} />
                  <DetailRow label="Student / staff ID" value={formatOrDash(item.finderInfo?.orgMemberId)} />
                  <DetailRow label="Phone number" value={formatOrDash(item.finderInfo?.phone)} />
                </div>

                <SectionTitle title="Intake" />
                <div className="rounded-xl bg-gray-50 px-4">
                  <DetailRow label="Created at" value={formatDateTimeOrDash(item.createdAt)} />
                  <DetailRow label="Receiving staff" value={formatOrDash(item.author?.displayName)} />
                </div>
              </div>
            )}

            {activeStep === 2 && isHandoverDone && (
              <div className="space-y-5">
                {item.status === 'Returned' ? (
                  <>
                    <SectionTitle title="Recipient — contact & ID" />
                    <div className="rounded-xl bg-gray-50 px-4">
                      <DetailRow label="Full name" value={formatOrDash(returnReportForPost?.ownerInfo?.ownerName)} />
                      <DetailRow label="Email" value={formatOrDash(returnReportForPost?.ownerInfo?.email)} />
                    </div>

                    <SectionTitle title="Recipient — identification" />
                    <div className="rounded-xl bg-gray-50 px-4">
                      <DetailRow label="National ID / citizen ID" value={formatOrDash(returnReportForPost?.ownerInfo?.nationalId)} />
                      <DetailRow label="Student / staff ID" value={formatOrDash(returnReportForPost?.ownerInfo?.orgMemberId)} />
                      <DetailRow label="Phone number" value={formatOrDash(returnReportForPost?.ownerInfo?.phone)} />
                    </div>

                    <SectionTitle title="Return release" />
                    <div className="rounded-xl bg-gray-50 px-4">
                      <DetailRow label="Created at" value={formatDateTimeOrDash(returnReportForPost?.createdAt)} />
                      <DetailRow label="Releasing staff" value={formatOrDash(returnReportForPost?.staff?.displayName)} />
                    </div>

                    {(returnReportForPost?.evidenceImageUrls?.length ?? 0) > 0 && (
                      <>
                        <SectionTitle title="Evidence photos" />
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {(returnReportForPost.evidenceImageUrls ?? []).map((url: string, idx: number) => (
                            <a
                              key={`${url}:${idx}`}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block overflow-hidden rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
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
                    )}
                  </>
                ) : (
                  <>
                    <SectionTitle title="Status update" />
                    <div className="rounded-xl bg-gray-50 px-4">
                      <DetailRow label="Status" value={inventoryStatusLabel(item.status)} />
                      <DetailRow label="Updated at" value={terminalAt} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {extra}
    </div>
  )
}
