import { useEffect, useState } from 'react'
import { Building2, User } from 'lucide-react'
import type { RevenueStatus, RevenueTransaction, SubscriberType } from '@/services/revenue.service'
import { revenueService } from '@/services/revenue.service'
import { TableFiltersBar } from '@/components/filters/table-filters-bar'
import { Pagination } from '@/components/ui/pagination'
import { SEARCH_DEBOUNCE_MS, useDebouncedValue } from '@/hooks/use-debounce'

const PAGE_SIZE = 5

const STATUS_CLASS: Record<RevenueStatus, string> = {
  Succeeded: 'bg-[#e8f9f0] text-[#06c167]',
  Pending:   'bg-[#fff8e6] text-[#c97a00]',
  Failed:    'bg-[#fff0f2] text-[#c13515]',
}

const formatCurrency = (amount: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function RevenueTransactionsTable() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS)
  const [typeFilter, setTypeFilter] = useState<SubscriberType | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<RevenueStatus | 'All'>('All')
  const [items, setItems] = useState<Array<RevenueTransaction>>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, typeFilter, statusFilter])

  useEffect(() => {
    revenueService.getTransactions({
      page,
      pageSize: PAGE_SIZE,
      subscriberType: typeFilter,
      status: statusFilter,
      search: debouncedSearch,
    }).then(res => {
      setItems(res.items)
      setTotal(res.total)
    }).catch(console.error)
  }, [page, debouncedSearch, typeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE + 1

  const resultLabel = total === 0 ? '0 results' : `${start}–${Math.min(start + PAGE_SIZE - 1, total)} of ${total}`

  return (
    <div className="space-y-4">
      <TableFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by organization, customer, invoice…"
        resultLabel={resultLabel}
        filters={[
          {
            label: 'Revenue Type',
            value: typeFilter,
            onChange: (v) => setTypeFilter(v as typeof typeFilter),
            options: [
              { value: 'Organization', label: 'Organization' },
              { value: 'User',         label: 'Customer' },
            ],
            allLabel: 'All types',
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: (v) => setStatusFilter(v as typeof statusFilter),
            options: [
              { value: 'Succeeded', label: 'Succeeded' },
              { value: 'Pending',   label: 'Pending' },
              { value: 'Failed',    label: 'Failed' },
            ],
            allLabel: 'All statuses',
          },
        ]}
      />

      <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#dddddd]">
              <tr>
                {['Type', 'Customer', 'Amount', 'Status', 'Payment', 'Date', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#929292] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {items.map((t) => {
                const isSub = t.subscriberType === 'Organization'
                const customerName = isSub ? t.tenantName : t.userName
                const customerSub  = isSub ? t.subscriptionPlan : undefined
                return (
                  <tr key={t.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSub ? 'bg-[#fff0f2] text-[#ff385c]' : 'bg-[#f7f7f7] text-[#6a6a6a]'}`}>
                        {t.subscriberType === 'Organization' ? 'Organization' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isSub ? 'bg-[#fff0f2]' : 'bg-[#f7f7f7]'}`}>
                          {isSub
                            ? <Building2 className="w-3.5 h-3.5 text-[#ff385c]" />
                            : <User className="w-3.5 h-3.5 text-[#6a6a6a]" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#222222] truncate">{customerName}</p>
                          {customerSub && <p className="text-xs text-[#929292] truncate">{customerSub}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#222222]">{formatCurrency(t.amount, t.currency)}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm text-[#6a6a6a]">{t.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm text-[#6a6a6a]">{formatDate(t.transactionDate)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#f0f0f0] flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
