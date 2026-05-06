import { useEffect, useState } from 'react'
import { Calendar, DollarSign, Package, QrCode, TrendingDown, TrendingUp } from 'lucide-react'
import type { RevenueSummary } from '@/services/revenue.service'
import { revenueService } from '@/services/revenue.service'

const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

export function RevenueStatCards() {
  const [summary, setSummary] = useState<RevenueSummary | null>(null)

  useEffect(() => {
    revenueService.getSummary().then(setSummary).catch(console.error)
  }, [])

  if (!summary) return null

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
      meta: (() => {
        const pct = summary.growthPercentage
        const isUp = pct >= 0
        return (
          <span className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-[#06c167]' : 'text-[#c13515]'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? '+' : ''}{pct}% vs last period
          </span>
        )
      })(),
    },
    {
      label: 'Subs Organizations',
      value: formatCurrency(summary.subscriptionRevenue),
      icon: Package,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
      meta: <span className="text-xs text-[#929292]">{summary.subscriptionTransactions.toLocaleString()} transactions · From Organizations</span>,
    },
    {
      label: 'Subs Customers',
      value: formatCurrency(summary.qrSalesRevenue),
      icon: QrCode,
      iconBg: 'bg-[#f7f7f7]',
      iconColor: 'text-[#6a6a6a]',
      meta: <span className="text-xs text-[#929292]">{summary.qrSalesTransactions.toLocaleString()} transactions · From Customers</span>,
    },
    {
      label: 'This Month',
      value: formatCurrency(summary.monthlyRevenue),
      icon: Calendar,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
      meta: <span className="text-xs text-[#929292]">Monthly Revenue</span>,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="bg-white rounded-[14px] border border-[#dddddd] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm text-[#6a6a6a]">{card.label}</span>
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#222222] tracking-tight mb-2">{card.value}</p>
            {card.meta}
          </div>
        )
      })}
    </div>
  )
}
