import { useEffect, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import type { MonthlyRevenueItem } from '@/services/revenue.service'
import { revenueService } from '@/services/revenue.service'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type ChartView = 'All' | 'Subscription' | 'QR Sales'
type TimeFilter = '12months' | '6months' | '3months' | '1month'

const TIME_SLICE: Record<TimeFilter, number> = { '12months': 12, '6months': 6, '3months': 3, '1month': 1 }

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

const formatYAxis = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

export function RevenueChart() {
  const [allData, setAllData] = useState<Array<MonthlyRevenueItem>>([])
  const [chartView, setChartView] = useState<ChartView>('All')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('12months')

  useEffect(() => {
    revenueService.getMonthly(12).then(setAllData).catch(console.error)
  }, [])

  const sliced = allData.slice(-TIME_SLICE[timeFilter])
  const chartData = chartView === 'All'
    ? sliced.map(d => ({ month: d.month, subscription: d.subscription, qrSales: d.qrSales }))
    : sliced.map(d => ({ month: d.month, revenue: chartView === 'Subscription' ? d.subscription : d.qrSales }))

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-[#222222]">Monthly Revenue Trend</h2>
          <p className="text-sm text-[#929292] mt-0.5">Revenue growth over selected period</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={chartView} onValueChange={(v) => setChartView(v as ChartView)}>
            <SelectTrigger className="h-8 w-[150px] border-[#dddddd] text-sm text-[#222222] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Revenue</SelectItem>
              <SelectItem value="Subscription">Subscription</SelectItem>
              <SelectItem value="QR Sales">QR Sales</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="h-8 w-[120px] border-[#dddddd] text-sm text-[#222222] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#929292', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatYAxis} tick={{ fill: '#929292', fontSize: 12 }} axisLine={false} tickLine={false} width={52} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #dddddd', borderRadius: '10px', fontSize: 13 }}
              formatter={(value: number | undefined) => [value != null ? formatCurrency(value) : '$0', undefined]}
              cursor={{ fill: '#f7f7f7' }}
            />
            {chartView === 'All' ? (
              <>
                <Bar dataKey="subscription" stackId="rev" fill="#ff385c" name="Subscription" radius={[0, 0, 0, 0]} animationDuration={600} />
                <Bar dataKey="qrSales"      stackId="rev" fill="#929292" name="QR Sales"     radius={[6, 6, 0, 0]} animationDuration={600} />
                <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13 }} iconType="circle" />
              </>
            ) : (
              <Bar
                dataKey="revenue"
                fill={chartView === 'Subscription' ? '#ff385c' : '#929292'}
                name={chartView}
                radius={[6, 6, 0, 0]}
                animationDuration={600}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
