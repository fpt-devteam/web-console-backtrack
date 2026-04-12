import { Layout } from '../../components/admin/layout'
import { ChevronRight, Info, Building2, Tag, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrgReturnReports } from '@/hooks/use-return-report'

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
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
      <div className="text-sm font-bold tracking-wide text-slate-900 uppercase">{title}</div>
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

export function AdminInventoryItemDetailPage() {
  const { slug, itemId } = useParams({ strict: false }) as { slug: string, itemId: string }
  const { currentOrgId } = useCurrentOrgId()
  const [mainImage, setMainImage] = useState(0)

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)
  const orgIdForHandover = item?.organization?.id ?? currentOrgId
  const { data: returnReports } = useOrgReturnReports(orgIdForHandover, 1, 50)
  const returnReportForPost =
    returnReports?.items?.find((r) => r.post?.id === item?.id) ?? null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-600 text-white'
      case 'InStorage':
        return 'bg-indigo-500 text-white'
      case 'ReturnScheduled':
        return 'bg-amber-500 text-white'
      case 'Returned':
        return 'bg-green-500 text-white'
      case 'Archived':
        return 'bg-slate-600 text-white'
      case 'Expired':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'Active': return 'Active'
      case 'InStorage': return 'In Storage'
      case 'ReturnScheduled': return 'Return Scheduled'
      case 'Returned': return 'Returned'
      case 'Archived': return 'Archived'
      case 'Expired': return 'Expired'
      default: return s
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!item) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
            <Link to="/console/$slug/admin/inventory" params={{ slug }}>
              <Button>Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const images = item.imageUrls?.length ? item.imageUrls : []
  const mainImg = images[mainImage] ?? images[0]

  return (
    <Layout>
      <div className="p-6 h-full overflow-y-auto mx-6">
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-600">
          <Link
            to="/console/$slug/admin/inventory"
            params={{ slug }}
            className="hover:text-gray-900 transition-colors"
          >
            Inventory
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{item.item.itemName}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{item.item.itemName}</h1>
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status)}`}>
                  {statusLabel(item.status)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Added {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            {/* View only - no action buttons here */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7">
            <div className="lg:col-span-3 p-6 border-r border-gray-200">
              <div className="relative h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {mainImg ? (
                  <img src={mainImg} alt={item.item.itemName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">No image</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => setMainImage(idx)}
                       className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                         mainImage === idx
                           ? 'border-blue-600 ring-2 ring-blue-200'
                           : 'border-gray-300 hover:border-gray-400'
                       }`}
                     >
                       <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                     </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 py-6 px-8 space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-semibold uppercase mb-2">STATUS</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>{statusLabel(item.status)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">CATEGORY</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>{item.item.category || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">EVENT TIME</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{item.eventTime ? new Date(item.eventTime).toLocaleString() : '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">BRAND</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{item.item.brand || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">COLOR</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{item.item.color || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">CONDITION</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{item.item.condition || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">MATERIAL</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{item.item.material || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase mb-2">SIZE</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{item.item.size || '—'}</span>
                  </div>
                </div>

                {item.item.distinctiveMarks && (
                  <div>
                    <div className="text-sm font-semibold uppercase mb-2">DISTINCTIVE MARKS</div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span>{item.item.distinctiveMarks}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold uppercase mb-2">Description</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.item.additionalDetails ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50/60">
            <div className="px-5 py-3 bg-slate-100/70 border-b border-slate-200">
              <div className="text-sm font-bold text-slate-950">Storage</div>
            </div>

            <div className="p-5 bg-white">
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
                <DetailRow label="Crea" value={formatDateTimeOrDash(item.createdAt)} />
                <DetailRow label="Receiving staff" value={formatOrDash(item.author?.displayName)} />
                <DetailRow label="Receiving staff ID" value={formatOrDash(item.author?.id)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50/60">
            <div className="px-5 py-3 bg-slate-100/70 border-b border-slate-200">
              <div className="text-sm font-bold text-slate-950">Return to owner</div>
            </div>

            <div className="p-5 bg-white">
              <SectionTitle title="Recipient — contact & ID" />
              <div className="mt-2">
                <DetailRow label="Full name" value={formatOrDash(returnReportForPost?.ownerInfo?.ownerName)} />
                <DetailRow label="Email (optional)" value={formatOrDash(returnReportForPost?.ownerInfo?.email)} />
              </div>

              <SectionTitle title="Recipient — identification (at least one)" />
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
