import { DetailRow, SectionTitle } from '../inventory-detail-primitives'
import { formatDateTimeOrDash, formatOrDash } from '../inventory-detail-format'

export function InventoryReturnedStep({ returnReportForPost }: { returnReportForPost: any }) {
  return (
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
  )
}
