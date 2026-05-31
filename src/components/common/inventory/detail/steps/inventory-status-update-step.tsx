import { DetailRow } from '../inventory-detail-primitives'
import { formatOrDash } from '../inventory-detail-format'

const VARIANTS = {
  archived: {
    bar: 'bg-amber-400',
    box: 'bg-amber-50 border-amber-100',
    note: 'text-amber-600',
    atLabel: 'Archived at',
    byLabel: 'Archived by',
    message: 'This item was archived and was not returned to an owner.',
  },
  expired: {
    bar: 'bg-slate-400',
    box: 'bg-slate-50 border-slate-200',
    note: 'text-slate-500',
    atLabel: 'Expired at',
    byLabel: 'Expired by',
    message: 'This item expired without being claimed and was not returned to an owner.',
  },
} as const

export function InventoryStatusUpdateStep({
  variant,
  terminalAt,
  staffName,
}: {
  variant: 'archived' | 'expired'
  terminalAt: string
  staffName: string | null | undefined
}) {
  const v = VARIANTS[variant]
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5 pb-1">
        <div className={`h-4 w-1 rounded-full shrink-0 ${v.bar}`} />
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Status update</span>
      </div>
      <div className={`rounded-xl border px-4 ${v.box}`}>
        <DetailRow label={v.atLabel} value={terminalAt} />
        <DetailRow label={v.byLabel} value={formatOrDash(staffName)} />
      </div>
      <p className={`text-xs leading-relaxed ${v.note}`}>{v.message}</p>
    </div>
  )
}
