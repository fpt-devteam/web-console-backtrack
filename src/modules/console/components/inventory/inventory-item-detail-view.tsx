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
    <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-200/70 last:border-0">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="text-sm text-slate-950 text-right">{value}</div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-3 first:pt-0">
      <div className="text-sm font-semibold tracking-wide text-slate-900 uppercase">{title}</div>
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
      ? 'bg-blue-600 ring-4 ring-blue-100 scale-[1.225] shadow-md'
      : state === 'done'
        ? 'bg-blue-600'
        : 'bg-slate-300'

  const textClass = state === 'active' ? 'text-slate-900' : state === 'done' ? 'text-slate-800' : 'text-slate-500'

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
      {showDate ? <span className="text-[11px] text-slate-500 whitespace-nowrap">{date}</span> : null}
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
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
          <Link to={backTo.to} params={backTo.params}>
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
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

  // Always open the first step (detail) when entering the view.
  const [activeStep, setActiveStep] = useState<number>(0)

  // Reset to detail when switching items.
  useEffect(() => {
    setActiveStep(0)
  }, [item.id])

  // Visual progress (completed steps) depends on current status.
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
    <div className="p-6 h-full overflow-y-auto mx-6">
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-600">
        <Link to={backTo.to} params={backTo.params} className="hover:text-gray-900 transition-colors">
          Inventory
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{headerPrimary}</span>
      </div>

      {/* Title outside the card */}
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${inventoryStatusPillClass(item.status)}`}>
              {inventoryStatusLabel(item.status)}
            </span>
          </div>
          <p className="text-xs text-gray-600">Added {addedAt}</p>
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-700">Progress</div>
              <div className="text-[11px] text-slate-500">Status timeline (click to view details)</div>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <StepperDot
                state={activeStep === 0 ? 'active' : progressStep >= 0 ? 'done' : 'todo'}
                label="Detail"
                date={addedAt}
                showDate={false}
                disabled={isTerminal}
                onClick={() => setActiveStep(0)}
              />
              <div className={`h-px w-10 sm:w-14 ${progressStep >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              <StepperDot
                state={activeStep === 1 ? 'active' : progressStep >= 1 ? 'done' : 'todo'}
                label="In Storage"
                date={intakeAt}
                disabled={isTerminal}
                onClick={() => setActiveStep(1)}
              />
              <div className={`h-px w-10 sm:w-14 ${progressStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
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

        <div className="grid grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-3 p-6 border-r border-gray-200">
            <div className="relative h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              {mainImg ? (
                <img src={mainImg} alt={imgAlt} className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onMainImageIndexChange(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
                  </button>
                ))}
                {showAddThumbnailButton ? (
                  <button className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <Camera className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 py-6 px-8 space-y-6 text-sm">
            {activeStep === 0 ? <InventoryDetailAttributeGrid item={item} subcategoryNameById={subcategoryNameById} /> : null}
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
                  <DetailRow label="Receiving staff ID" value={formatOrDash(item.author?.id)} />
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
                      <DetailRow label="Releasing staff ID" value={formatOrDash(returnReportForPost?.staff?.id)} />
                    </div>
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

