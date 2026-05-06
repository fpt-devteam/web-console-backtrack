import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  PackageSearch,
  Palette,
  Pin,
  Ruler,
  StickyNote,
  Tag,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ElementType } from 'react'
import { useGetPost } from '@/hooks/use-post'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { Skeleton } from '@/components/ui/skeleton'
import type { SupportFormData } from '@/types/chat.types'

interface PinnedPostCardProps {
  supportFormData: SupportFormData
}

function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatEventTime(value: Date | string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value as string)
  if (isNaN(d.getTime())) return ''
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  return `${hh}:${mm}  ·  ${dd}/${mo}/${d.getFullYear()}`
}

function DetailCard({ icon: Icon, label, value, accent = false, className }: {
  icon: ElementType
  label: string
  value: string
  accent?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3 ${className ?? ''}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${accent ? 'bg-brand-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <Icon className={`w-4 h-4 ${accent ? 'text-brand-600' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-[13px] font-semibold text-gray-800 mt-1 leading-snug break-words">{value}</p>
      </div>
    </div>
  )
}

function MiniImageStrip({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  if (images.length === 0) return null
  return (
    <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`post photo ${idx + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center"
          >
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>
          <button
            type="button"
            onClick={() => setIdx(i => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center"
          >
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function HeroCarousel({ images, title, isLost, category, onClose }: {
  images: Array<string>
  title: string
  isLost: boolean
  category: string
  onClose: () => void
}) {
  const [idx, setIdx] = useState(0)
  const hasImages = images.length > 0
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  return (
    <div className="relative shrink-0">
      <div className="w-full h-52 sm:h-56 relative overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={images[idx]}
              alt={`${title} photo ${idx + 1}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageSearch className="w-16 h-16 text-brand-200" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {images.length > 1 && (
        <>
          <button type="button" onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button type="button" onClick={next}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}

      <button type="button" onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/30">
        <Pin className="w-3 h-3 text-white -rotate-45" strokeWidth={2.5} />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pinned item</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
        <p className="text-white font-black text-[18px] leading-tight drop-shadow-sm truncate mb-1.5">{title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isLost ? 'bg-rose-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
              <span className="w-1 h-1 rounded-full bg-white inline-block" />
              {isLost ? 'Lost' : 'Found'}
            </span>
            {category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                {category}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex items-center gap-1">
              {images.map((_, i) => (
                <button key={i} type="button" onClick={() => setIdx(i)}
                  className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PinnedPostCard({ supportFormData }: PinnedPostCardProps) {
  const { currentOrgId } = useCurrentOrgId()
  const { data: post, isLoading } = useGetPost(currentOrgId ?? null, supportFormData.postId)
  const [showPopup, setShowPopup] = useState(false)
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-50 border-b border-brand-100">
        <Pin className="w-3.5 h-3.5 text-brand-300 shrink-0 -rotate-45" strokeWidth={2.5} />
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
      </div>
    )
  }

  if (!post) return null

  const heroImages = (supportFormData.imageUrls ?? []).length > 0
    ? (supportFormData.imageUrls ?? [])
    : []
  const isLost = post.postType === 'Lost'
  const eventTimeStr = formatEventTime(supportFormData.eventTime)
  const postEventTimeStr = formatEventTime(post.eventTime)

  return (
    <>
      {/* Card row */}
      <motion.button
        type="button"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center gap-4 px-5 py-4
                   bg-brand-50 border-b border-brand-100
                   hover:bg-brand-100/60 active:bg-brand-100
                   transition-colors text-left overflow-hidden"
      >
        <Pin className="w-4 h-4 text-brand-400 shrink-0 -rotate-45" strokeWidth={2.5} aria-hidden="true" />

        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shrink-0 border border-brand-100 shadow-sm">
          {heroImages[0] ? (
            <img src={heroImages[0]} alt={post.postTitle} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <PackageSearch className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider leading-none mb-1">Pinned item</p>
          <p className="text-sm font-semibold text-gray-800 truncate leading-snug">{post.postTitle}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${isLost ? 'bg-rose-400' : 'bg-emerald-400'}`} />
            <span className="text-[11px] text-gray-400">
              {isLost ? 'Lost item' : 'Found item'} · {post.category}
            </span>
          </div>
        </div>

        <Pin className="w-4 h-4 text-gray-300 shrink-0 rotate-45" strokeWidth={2} />
      </motion.button>

      {/* Detail popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false) }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full sm:max-w-6xl rounded-t-3xl sm:rounded-3xl
                         max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Hero — post inventory images */}
              <HeroCarousel
                images={post.imageUrls}
                title={post.postTitle}
                isLost={isLost}
                category={post.category}
                onClose={() => setShowPopup(false)}
              />

              {/* Body — 2-column comparison */}
              <div className="overflow-y-auto flex-1">
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                  {/* Left — submitted form data */}
                  <div className="px-5 pt-5 pb-8 space-y-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Request from user
                    </p>
                    {heroImages.length > 0 ? (
                      <MiniImageStrip images={heroImages} />
                    ) : (
                      <div className="w-full h-60 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                        <PackageSearch className="w-12 h-12 text-gray-300" strokeWidth={1} />
                      </div>
                    )}
                    <DetailCard icon={Package} label="Item name" value={supportFormData.itemName} accent />
                    <DetailCard icon={Palette} label="Color" value={supportFormData.color} />
                    <DetailCard icon={MapPin} label="Lost location" value={supportFormData.lostLocation ?? '---'} />
                    <DetailCard icon={CalendarClock} label="Date & time of loss" value={eventTimeStr || '---'} />
                    <DetailCard icon={StickyNote} label="Additional details" value={supportFormData.additionalDetails ?? '---'} />
                  </div>

                  {/* Right — linked post data */}
                  <div className="px-5 pt-5 pb-8 space-y-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Information Inventory Item
                    </p>

                    {post.imageUrls.length > 0 && (
                      <MiniImageStrip images={post.imageUrls} />
                    )}

                    <DetailCard icon={Package} label="Item name" value={post.postTitle} accent />

                    {/* Cards */}
                    {post.cardDetail && (<>
                      <DetailCard icon={User} label="Holder name" value={post.cardDetail.holderName ?? '---'} />
                      <DetailCard icon={CreditCard} label="Card number" value={post.cardDetail.cardNumberMasked ?? '---'} />
                      <DetailCard icon={Building2} label="Issuing authority" value={post.cardDetail.issuingAuthority ?? '---'} />
                      <DetailCard icon={CalendarClock} label="Date of birth" value={formatDate(post.cardDetail.dateOfBirth) || '---'} />
                      <div className="flex items-center gap-2">
                        <DetailCard icon={CalendarClock} label="Issue date" value={formatDate(post.cardDetail.issueDate) || '---'} className="flex-1" />
                        <DetailCard icon={CalendarClock} label="Expiry date" value={formatDate(post.cardDetail.expiryDate) || '---'} className="flex-1" />
                      </div>
                      
                      <DetailCard icon={StickyNote} label="Notes" value={post.cardDetail.additionalDetails ?? '---'} />
                    </>)}

                    {/* Personal belongings */}
                    {post.personalBelongingDetail && (<>
                    <div className="flex items-center gap-2">
                        <DetailCard icon={Tag} label="Brand" value={post.personalBelongingDetail.brand ?? '---'} className="flex-1" />
                        <DetailCard icon={Palette} label="Color" value={post.personalBelongingDetail.color ?? '---'} className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <DetailCard icon={Package} label="Material" value={post.personalBelongingDetail.material ?? '---'} className="flex-1" />
                        <DetailCard icon={Ruler} label="Size" value={post.personalBelongingDetail.size ?? '---'} className="flex-1" />
                      </div>
                      <DetailCard icon={Package} label="Condition" value={post.personalBelongingDetail.condition ?? '---'} />
                      <DetailCard icon={StickyNote} label="Distinctive marks" value={post.personalBelongingDetail.distinctiveMarks ?? '---'} />
                    </>)}

                    {/* Electronics */}
                    {post.electronicDetail && (<>
                    <div className="flex items-center gap-2">
                        <DetailCard icon={Tag} label="Brand" value={post.electronicDetail.brand ?? '---'} className="flex-1" />
                        <DetailCard icon={Tag} label="Model" value={post.electronicDetail.model ?? '---'} className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <DetailCard icon={Palette} label="Color" value={post.electronicDetail.color ?? '---'} className="flex-1" />
                        <DetailCard icon={Package} label="Screen condition" value={post.electronicDetail.screenCondition ?? '---'} className="flex-1" />
                      </div>
                      
                      <DetailCard icon={StickyNote} label="Case / accessories" value={post.electronicDetail.caseDescription ?? '---'} />
                      <DetailCard icon={StickyNote} label="Lock screen" value={post.electronicDetail.lockScreenDescription ?? '---'} />
                    </>)}

                    {/* Others */}
                    {post.otherDetail && (<>
                      <DetailCard icon={Palette} label="Primary color" value={post.otherDetail.primaryColor ?? '---'} />
                      <DetailCard icon={StickyNote} label="Notes" value={post.otherDetail.additionalDetails ?? '---'} />
                    </>)}

                    <DetailCard icon={MapPin} label="Location" value={post.organizationFoundLocation ?? '---'} />
                    <DetailCard icon={CalendarClock} label="Date & time" value={postEventTimeStr || '---'} />
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
