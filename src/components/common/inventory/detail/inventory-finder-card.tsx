import { Mail, Phone, User } from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import { DetailRow, SectionTitle } from './inventory-detail-primitives'
import { formatOrDash } from './inventory-detail-format'

export function InventoryFinderCard({ item }: { item: InventoryItem }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle title="Finder information" />
        <div className="mt-3 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 p-4">
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
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5  pt-3">
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
      </div>

      <div>
        <SectionTitle title="Identification" />
        <div className="mt-2 rounded-xl px-4 py-2 bg-gray-50">
          <DetailRow label="National ID" value={formatOrDash(item.finderInfo?.nationalId)} />
          <DetailRow label="Member ID" value={formatOrDash(item.finderInfo?.orgMemberId)} />
        </div>
      </div>
    </div>
  )
}
