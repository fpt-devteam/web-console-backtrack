import type { ReactNode } from 'react'
import { Package, User } from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import { getInventoryDescription, getInventoryDistinctiveMarks, getInventoryTitle } from '@/utils/inventory-view'

type TableRow =
  | { kind: 'section'; title: string; hint?: string }
  | { kind: 'field'; label: string; value: ReactNode }

function Mono({ children }: { children: ReactNode }) {
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
  const rows: TableRow[] = [
    { kind: 'section', title: 'Item' },
    { kind: 'field', label: 'Name', value: vOrUnderscore(getInventoryTitle(item)) },
    { kind: 'field', label: 'Category', value: vOrUnderscore(item.category) },
    { kind: 'field', label: 'Distinctive marks', value: vOrUnderscore(getInventoryDistinctiveMarks(item) ?? undefined) },
    { kind: 'field', label: 'Details', value: vOrUnderscore(getInventoryDescription(item) ?? undefined) },
    { kind: 'section', title: 'Status & timing' },
    { kind: 'field', label: 'Status', value: vOrUnderscore(item.status) },
    { kind: 'field', label: 'Found time', value: fmtDateTime(item.eventTime) },
    { kind: 'field', label: 'Created at', value: fmtDateTime(item.createdAt) },
    { kind: 'field', label: 'Internal location', value: vOrUnderscore(item.internalLocation ?? undefined) },
    { kind: 'section', title: 'Author / organization' },
    {
      kind: 'field',
      label: 'Author',
      value: item.author?.displayName ? (
        <span className="inline-flex items-center gap-2">
          <User className="w-4 h-4 text-gray-700 shrink-0" />
          <span className="font-medium">{item.author.displayName}</span>
          <span className="text-gray-600">(<Mono>{item.author.id}</Mono>)</span>
        </span>
      ) : item.author?.id ? (
        <Mono>{item.author.id}</Mono>
      ) : (
        '_'
      ),
    },
    {
      kind: 'field',
      label: 'Organization',
      value: item.organization?.name ? (
        <span className="inline-flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-700 shrink-0" />
          <span className="font-medium">{item.organization.name}</span>
          {item.organization.id ? <span className="text-gray-600">(<Mono>{item.organization.id}</Mono>)</span> : null}
        </span>
      ) : (
        '_'
      ),
    },
    { kind: 'section', title: 'IDs' },
    { kind: 'field', label: 'Post ID', value: <Mono>{item.id}</Mono> },
  ]

  return (
    <div className="mt-8 w-full">
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
        <div className="px-4 sm:px-5 py-3 border-b border-blue-100 bg-blue-100">
          <div className="text-gray-900">
            <h2 className="text-base font-semibold">Record details</h2>
            <p className="text-xs text-gray-800 mt-0.5">This view reflects the current backend fields for inventory.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableBody rows={rows} />
          </table>
        </div>
      </section>
    </div>
  )
}

