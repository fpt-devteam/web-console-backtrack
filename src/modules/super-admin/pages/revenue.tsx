import { Download } from 'lucide-react'
import { Layout } from '../components/layout'
import { RevenueChart, RevenueStatCards, RevenueTransactionsTable } from '../components'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'

export function RevenuePage() {
  const handleExport = () => console.log('Export revenue data')

  return (
    <Layout>
      <SiteHeader
        crumbs={[{ label: 'Revenue Management' }]}
        actions={
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="rounded-[20px] border-[#dddddd] text-[#6a6a6a] hover:bg-[#f7f7f7] gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <RevenueStatCards />
        <RevenueChart />
        <RevenueTransactionsTable />
      </div>
    </Layout>
  )
}
