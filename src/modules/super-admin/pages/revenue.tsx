import { Download } from 'lucide-react'
import { Layout } from '../components/layout'
import { RevenueChart, RevenueStatCards, RevenueTransactionsTable } from '../components'

export function RevenuePage() {
  const handleExport = () => console.log('Export revenue data')

  return (
    <Layout>
      <div className="p-8 bg-[#f7f7f7] min-h-screen space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] mb-1">Revenue</h1>
            <p className="text-[#6a6a6a]">Track platform revenue, subscriptions, and transactions.</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-medium bg-[#ff385c] text-white border border-transparent hover:bg-white hover:text-[#ff385c] hover:border-[#ff385c] transition-colors active:scale-[0.96]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="space-y-6">
          <RevenueStatCards />
          <RevenueChart />
          <RevenueTransactionsTable />
        </div>
      </div>
    </Layout>
  )
}
