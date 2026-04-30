import { useState } from 'react'
import { StaffLayout } from '../../components/staff'
import { IntakeHistory } from './history-tabs/intake-history'
import { HandoverHistory } from './history-tabs/handover-history'

type Tab = 'intake' | 'handover'

const TABS: { value: Tab; label: string }[] = [
  { value: 'intake', label: 'Intake' },
  { value: 'handover', label: 'Return' },
]

export function StaffProcessingHistoryPage() {
  const [tab, setTab] = useState<Tab>('intake')

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0">
          <h1 className="text-2xl font-bold text-black">Handling History</h1>

          {/* Tabs (match Inventory status tabs UI) */}
          <div className="flex gap-2 my-4">
            {TABS.map(({ value, label }) => {
              const active = tab === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={[
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap active:scale-[0.97]',
                    active
                      ? 'border-primary text-primary bg-white shadow-sm'
                      : 'border-hairline text-ash bg-white hover:bg-neutral-50 hover:border-ink hover:text-ink transition-colors',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {tab === 'intake' && <IntakeHistory />}
            {tab === 'handover' && <HandoverHistory />}
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}
