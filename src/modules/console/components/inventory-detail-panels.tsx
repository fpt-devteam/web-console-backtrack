import type { ReactNode } from 'react'
import { ArrowRightLeft, PackageCheck, Smartphone } from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'

type TableRow =
  | { kind: 'section'; title: string; hint?: string }
  | { kind: 'field'; label: string; value: ReactNode }

function IdText({ children }: { children: ReactNode }) {
  return <span className="font-mono text-gray-900 tabular-nums">{children}</span>
}

function TableBody({ rows }: { rows: TableRow[] }) {
  return (
    <tbody>
      {rows.map((row, i) => {
        if (row.kind === 'section') {
          return (
            <tr key={`s-${i}-${row.title}`} className="bg-slate-50/95 border-y border-slate-100">
              <td colSpan={2} className="py-2.5 px-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-900">{row.title}</div>
                {row.hint ? <div className="text-[11px] text-gray-700 mt-0.5">{row.hint}</div> : null}
              </td>
            </tr>
          )
        }
        return (
          <tr key={`f-${i}-${row.label}`} className="border-b border-gray-100 last:border-0">
            <td className="py-3 px-4 text-gray-700 align-top w-[40%]">{row.label}</td>
            <td className="py-3 px-4 text-gray-900 align-top">{row.value}</td>
          </tr>
        )
      })}
    </tbody>
  )
}

function fmtDateTime(value: string | null | undefined): string {
  if (!value) return '_'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function vOrUnderscore(value: string | null | undefined): ReactNode {
  const v = value?.toString().trim()
  return v ? v : '_'
}

export function InventoryDetailPanels({ item }: { item: InventoryItem }) {
  const finder = item.finderContact

  const intakeRows: TableRow[] = [
    {
      kind: 'section',
      title: 'Finder — contact & ID',
      hint: 'Person who found the item or handed it in for storage.',
    },
    { kind: 'field', label: 'Full name', value: vOrUnderscore(finder?.name) },
    { kind: 'field', label: 'Email', value: vOrUnderscore(finder?.email ?? undefined) },
    {
      kind: 'section',
      title: 'Finder — identification',
      hint: 'National ID number and/or student or staff ID — stored as text and numbers only.',
    },
    {
      kind: 'field',
      label: 'National ID / citizen ID',
      value: finder?.nationalId ? <IdText>{finder.nationalId}</IdText> : '_',
    },
    {
      kind: 'field',
      label: 'Student / staff ID',
      value: finder?.orgMemberId ? <IdText>{finder.orgMemberId}</IdText> : '_',
    },
    {
      kind: 'field',
      label: 'Phone number',
      value: finder?.phone ? (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-gray-700 shrink-0" />
          <IdText>{finder.phone}</IdText>
        </span>
      ) : (
        '_'
      ),
    },
    { kind: 'section', title: 'Intake / handover to facility', hint: 'When the item entered your process.' },
    { kind: 'field', label: 'Handover time', value: fmtDateTime(item.loggedAt) },
    { kind: 'field', label: 'From · To', value: `${finder?.name?.trim() || 'Finder'} → ${item.storageLocation || '_'}` },
    { kind: 'field', label: 'Receiving staff (ID)', value: vOrUnderscore(item.receiverStaffId ?? undefined) },
    { kind: 'field', label: 'Notes', value: '_' },
  ]

  const hasReturnInfo = item.status === 'Returned' || Boolean(item.handoverStaffId)

  const returnRows: TableRow[] = [
    {
      kind: 'section',
      title: 'Recipient — contact & ID',
      hint: 'Person picking up the item (owner or authorized claimant).',
    },
    { kind: 'field', label: 'Full name', value: hasReturnInfo ? '_' : '_' },
    { kind: 'field', label: 'Email (optional)', value: '_' },
    {
      kind: 'section',
      title: 'Recipient — identification',
      hint: 'Must match your release policy. Text and numbers only.',
    },
    { kind: 'field', label: 'National ID / citizen ID', value: '_' },
    { kind: 'field', label: 'Student / staff ID', value: '_' },
    { kind: 'field', label: 'Phone number', value: '_' },
    { kind: 'section', title: 'Return release', hint: 'When the item leaves storage to the recipient.' },
    { kind: 'field', label: 'Status', value: hasReturnInfo ? item.status : '_' },
    { kind: 'field', label: 'Expected / actual pickup date', value: '_' },
    { kind: 'field', label: 'Releasing staff (ID)', value: hasReturnInfo ? vOrUnderscore(item.handoverStaffId) : '_' },
    { kind: 'field', label: 'Signature / confirmation', value: '_' },
  ]

  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3 border-b border-blue-100 bg-blue-100">
            <div className="flex items-center gap-2 text-gray-900">
              <ArrowRightLeft className="w-5 h-5 shrink-0" />
              <div>
                <h2 className="text-base font-semibold">Storage / handover</h2>
                <p className="text-xs text-gray-800 mt-0.5">Finder — who found or turned in the item</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableBody rows={intakeRows} />
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-3 border-b border-blue-100 bg-blue-100">
            <div className="flex items-center gap-2 text-gray-900">
              <PackageCheck className="w-5 h-5 shrink-0" />
              <div>
                <h2 className="text-base font-semibold">Return to owner</h2>
                <p className="text-xs text-gray-800 mt-0.5">Recipient — who receives the item</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableBody rows={returnRows} />
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

