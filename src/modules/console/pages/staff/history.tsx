import { useState } from 'react'
import { StaffLayout } from '../../components/staff'
import { IntakeHistory } from './history-tabs/intake-history'
import { HandoverHistory } from './history-tabs/handover-history'
import { SiteHeader } from '@/components/layout/site-header'

type Tab = 'intake' | 'handover'

const TABS: { value: Tab; label: string }[] = [
  { value: 'intake', label: 'Intake' },
  { value: 'handover', label: 'Return' },
]

export function StaffProcessingHistoryPage() {
  const [tab, setTab] = useState<Tab>('intake')

  return (
    <StaffLayout>
      <SiteHeader crumbs={[{ label: 'Handling History' }]} />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Airbnb-style underline tab strip */}
        <div className="border-b border-[#dddddd] mb-6">
          <div className="flex items-center gap-6">
            {TABS.map(({ value, label }) => {
              const active = tab === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={[
                    'relative whitespace-nowrap py-3 text-sm font-medium transition-colors',
                    active ? 'text-[#222222]' : 'text-[#6a6a6a] hover:text-[#222222]',
                  ].join(' ')}
                >
                  {label}
                  <span
                    className={[
                      'absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors',
                      active ? 'bg-[#222222]' : 'bg-transparent',
                    ].join(' ')}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {tab === 'intake' && <IntakeHistory />}
        {tab === 'handover' && <HandoverHistory />}
      </div>
    </StaffLayout>
  )
}
