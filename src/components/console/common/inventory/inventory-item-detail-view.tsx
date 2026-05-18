import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Check, ChevronRight, Camera, ImageOff, Mail, Phone, User, Tag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import type { InventoryItem } from '@/services/inventory.service'
import { inventoryStatusLabel, inventoryStatusPillClass } from './status'
import { getInventorySubcategoryName, getInventoryTitle } from '@/utils/inventory-view'
import { categoryLabel, InventoryDetailAttributeGrid, ItemQrCard } from './inventory-detail-attribute-grid'
import { useChatConversationsByPostId } from '@/hooks/use-chat'
import { statusBadge, statusLabel } from '@/components/console/staff/my-task/task-utils'
import { useUser } from '@/hooks/use-user'
import { AdminModal } from '@/components/console/admin/AdminModal'
import { TaskConversation } from '@/components/console/staff/my-task/task-conversation'
import { ConversationStatus, type IConversation } from '@/types/chat.types'
import { Avatar } from '@/components/console/staff/my-task/avatar'

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

type StepVariant = 'rose' | 'amber' | 'slate'

const VARIANT_COLORS: Record<StepVariant, {
  activeBorder: string; activeBg: string; activeRing: string; activeDot: string
  doneBorder: string; doneBg: string
  activeText: string
}> = {
  rose: {
    activeBorder: 'border-rose-500', activeBg: 'bg-rose-50', activeRing: 'ring-rose-100', activeDot: 'bg-rose-500',
    doneBorder: 'border-rose-500', doneBg: 'bg-rose-500',
    activeText: 'text-rose-600',
  },
  amber: {
    activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', activeRing: 'ring-amber-100', activeDot: 'bg-amber-500',
    doneBorder: 'border-amber-500', doneBg: 'bg-amber-500',
    activeText: 'text-amber-600',
  },
  slate: {
    activeBorder: 'border-slate-400', activeBg: 'bg-slate-50', activeRing: 'ring-slate-100', activeDot: 'bg-slate-400',
    doneBorder: 'border-slate-400', doneBg: 'bg-slate-400',
    activeText: 'text-slate-500',
  },
}

function StepperDot({
  state,
  label,
  date,
  showDate = true,
  disabled = false,
  variant = 'rose',
  onClick,
}: {
  state: 'done' | 'active' | 'todo'
  label: string
  date: string
  showDate?: boolean
  disabled?: boolean
  variant?: StepVariant
  onClick?: () => void
}) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  const c = VARIANT_COLORS[variant]

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={['group flex flex-col items-center gap-1.5 min-w-0', disabled ? 'cursor-default' : 'cursor-pointer'].join(' ')}
      aria-current={isActive ? 'step' : undefined}
    >
      <span className={[
        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0',
        isActive ? `${c.activeBorder} ${c.activeBg} ring-4 ${c.activeRing} scale-110`
          : isDone ? `${c.doneBorder} ${c.doneBg}`
            : 'border-gray-200 bg-white',
      ].join(' ')}>
        {isActive
          ? <span className={`w-3 h-3 rounded-full ${c.activeDot}`} />
          : isDone
            ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
            : <span className="w-2 h-2 rounded-full bg-gray-300" />}
      </span>
      <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? c.activeText : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
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

  // 0: In Storage | 1: Conversations | 2: Returned | 3: Archived | 4: Expired
  const [activeStep, setActiveStep] = useState<number>(0)

  useEffect(() => {
    if (item.status === 'Returned') setActiveStep(2)
    else if (item.status === 'Archived') setActiveStep(3)
    else if (item.status === 'Expired') setActiveStep(4)
    else setActiveStep(0)
  }, [item.id, item.status])

  const intakeAt = useMemo(() => formatDateTimeOrDash(item.createdAt), [item.createdAt])
  const terminalAt = useMemo(
    () => formatDateTimeOrDash((item as any).updatedAt ?? item.createdAt),
    [item],
  )

  const meQuery = useUser()
  const myUserId = meQuery.data?.id
  const relatedConvsQuery = useChatConversationsByPostId(item.id, item.organization?.id ?? undefined)
  const relatedConvs = relatedConvsQuery.data ?? []
  const [openConv, setOpenConv] = useState<IConversation | null>(null)

  return (
    <div className="mx-auto h-full w-full overflow-y-auto px-10 py-4  ">

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
              <Tag className="w-4 h-4 text-gray-400 shrink-0 text-rose-500" /> 
              {categoryLabel(item.category)}{subName.trim() ? ` · ${subName.trim()}` : ''}
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
                  state={activeStep === 0 ? 'active' : 'done'}
                  label="In Storage"
                  date={intakeAt}
                  variant="rose"
                  onClick={() => setActiveStep(0)}
                />
                <div className="h-0.5 w-10 shrink-0 rounded-full sm:w-14 md:w-20 bg-gray-200" />
                <StepperDot
                  state={activeStep === 1 ? 'active' : activeStep > 1 ? 'done' : 'todo'}
                  label="Conversations"
                  date={
                    relatedConvsQuery.isLoading
                      ? 'Loading…'
                      : `${relatedConvs.length} conversation${relatedConvs.length === 1 ? '' : 's'}`
                  }
                  variant="rose"
                  onClick={() => setActiveStep(1)}
                />
                <div className="h-0.5 w-10 shrink-0 rounded-full sm:w-14 md:w-20 bg-gray-200" />
                {item.status === 'Archived' ? (
                  <StepperDot
                    state={activeStep === 3 ? 'active' : 'done'}
                    label="Archived"
                    date={terminalAt}
                    variant="amber"
                    onClick={() => setActiveStep(3)}
                  />
                ) : item.status === 'Expired' ? (
                  <StepperDot
                    state={activeStep === 4 ? 'active' : 'done'}
                    label="Expired"
                    date={terminalAt}
                    variant="slate"
                    onClick={() => setActiveStep(4)}
                  />
                ) : (
                  <StepperDot
                    state={item.status === 'Returned' ? (activeStep === 2 ? 'active' : 'done') : 'todo'}
                    label="Returned"
                    date={item.status === 'Returned' ? formatDateTimeOrDash(returnReportForPost?.createdAt) : '—'}
                    variant="rose"
                    disabled={item.status !== 'Returned'}
                    onClick={() => setActiveStep(2)}
                  />
                )}
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

            {/* QR + Received by */}
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
              {item.organization?.slug ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">QR Code</p>
                  <ItemQrCard orgSlug={item.organization.slug} itemId={item.id} />
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Received by</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div>
                <SectionTitle title="Assignee" />
                <div className="mt-2 rounded-xl bg-gray-50 px-4">
                  <DetailRow label="Received at" value={formatDateTimeOrDash(item.createdAt)} />
                  <DetailRow label="Receiving staff" value={formatOrDash(item.author?.displayName)} />
                </div>
              </div>
            </div>
          </div>

          {/* Details panel */}
          <div className="px-5 py-5 sm:px-6 sm:py-6 lg:col-span-4 lg:px-8 lg:py-6">
            {/* Step 0 — In Storage */}
            {activeStep === 0 && (
              <div className="space-y-6">
                <div>
                  <SectionTitle title="Item details" />
                  <div className="mt-3">
                    <InventoryDetailAttributeGrid
                      item={item}
                      subcategoryNameById={subcategoryNameById}
                      orgSlug={item.organization?.slug}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Finder Information</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shrink-0">
                      <User className="w-6 h-6 text-sky-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-0.5">Finder</p>
                      <p className="text-base font-bold text-gray-900 truncate">
                        {formatOrDash(item.finderInfo?.finderName)}
                      </p>
                    </div>
                  </div>
                  {(item.finderInfo?.email ?? item.finderInfo?.phone) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-sky-100 pt-3">
                      {item.finderInfo.email && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {item.finderInfo.email}
                        </div>
                      )}
                      {item.finderInfo.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {item.finderInfo.phone}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <SectionTitle title="Identification" />
                  <div className="mt-2 rounded-xl bg-gray-50 px-4">
                    <DetailRow label="National ID / citizen ID" value={formatOrDash(item.finderInfo?.nationalId)} />
                    <DetailRow label="Student / staff ID" value={formatOrDash(item.finderInfo?.orgMemberId)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Conversations */}
            {activeStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <SectionTitle title="Conversations" />
                </div>

                {relatedConvsQuery.isLoading ? (
                  <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 py-10">
                    <Spinner />
                  </div>
                ) : relatedConvsQuery.isError ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    Failed to load related conversations.
                  </div>
                ) : relatedConvs.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-gray-700">No conversations yet</p>
                    <p className="text-xs text-gray-500 mt-1">This item doesn’t have any related support chats.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relatedConvs.map((conv) => {
                      const partner = conv.partner?.displayName ?? conv.partner?.email ?? conv.id.slice(0, 8)
                      const isAssignedToOtherStaff =
                        !!conv.assignedStaffId && !!myUserId && conv.assignedStaffId !== myUserId
                      const isLocked = !!conv.assignedStaffId && (!myUserId || isAssignedToOtherStaff)
                      return (
                        <button
                          key={conv.id}
                          type="button"
                          disabled={isLocked}
                          onClick={() => {
                            if (isLocked) return
                            setOpenConv(conv)
                          }}
                          title={isAssignedToOtherStaff ? 'This conversation is being handled by another staff member.' : undefined}
                          className={[
                            'w-full text-left rounded-2xl border px-4 py-3 shadow-sm transition-shadow',
                            isLocked
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-80'
                              : 'border-gray-200 bg-white hover:shadow-md',
                          ].join(' ')}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{partner}</p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {conv.lastMessageContent ?? 'No messages yet'}
                              </p>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(conv.status)}`}>
                                {statusLabel(conv.status)}
                              </span>
                              <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                {formatDateTimeOrDash(conv.lastMessageAt ?? conv.updatedAt)}
                              </span>
                            </div>
                          </div>
                          {isAssignedToOtherStaff && (
                            <div className="">
                              <span className="inline-flex items-center rounded-full bg-neutral-100  py-1 text-[11px] font-bold text-neutral-500">
                                Assigned to other staff
                              </span>
                            </div>
                          )}
                          {typeof conv.unreadCount === 'number' && conv.unreadCount > 0 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                                {conv.unreadCount} unread
                              </span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                <AdminModal
                  open={!!openConv}
                  title={
                    openConv?.partner?.displayName ??
                    openConv?.partner?.email ??
                    (openConv ? `Conversation ${openConv.id.slice(0, 8)}` : 'Conversation')
                  }
                  header={
                    openConv ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          url={openConv.partner?.avatarUrl}
                          name={openConv.partner?.displayName ?? openConv.partner?.email ?? openConv.id.slice(0, 2)}
                          className="w-9 h-9 rounded-full shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-base sm:text-lg font-semibold text-[#222222] truncate">
                            {openConv.partner?.displayName ?? openConv.partner?.email ?? openConv.id.slice(0, 8)}
                          </p>
                          {openConv.partner?.email && openConv.partner?.displayName ? (
                            <p className="text-xs text-[#929292] truncate">{openConv.partner.email}</p>
                          ) : null}
                        </div>
                      </div>
                    ) : null
                  }
                  onClose={() => setOpenConv(null)}
                >
                  {openConv && (
                    <div className="h-[70vh] min-h-[520px] flex flex-col rounded-xl border border-[#ebebeb] overflow-hidden">
                      <TaskConversation
                        conversationId={openConv.id}
                        partner={openConv.partner}
                        readOnly={openConv.status === ConversationStatus.CLOSED}
                        viewOnly
                      />
                    </div>
                  )}
                </AdminModal>
              </div>
            )}

            {/* Step 2 — Returned */}
            {activeStep === 2 && (
              <div className="space-y-5">
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
                  <DetailRow label="Returned at" value={formatDateTimeOrDash(returnReportForPost?.createdAt)} />
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
              </div>
            )}

            {/* Step 3 — Archived */}
            {activeStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-1">
                  <div className="h-4 w-1 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status update</span>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4">
                  <DetailRow label="Archived at" value={terminalAt} />
                  <DetailRow label="Archived by" value={formatOrDash(returnReportForPost?.staff?.displayName)} />
                </div>
                <p className="text-xs text-amber-600 leading-relaxed">
                  This item was archived and was not returned to an owner.
                </p>
              </div>
            )}

            {/* Step 4 — Expired */}
            {activeStep === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-1">
                  <div className="h-4 w-1 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status update</span>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4">
                  <DetailRow label="Expired at" value={terminalAt} />
                  <DetailRow label="Expired by" value={formatOrDash(returnReportForPost?.staff?.displayName)} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This item expired without being claimed and was not returned to an owner.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {extra}
    </div>
  )
}
