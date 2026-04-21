import { StaffLayout } from '../../components/staff'
import { useState } from 'react'
import { IntakeHistory } from './history-tabs/intake-history'
import { HandoverHistory } from './history-tabs/handover-history'

export function StaffProcessingHistoryPage() {
  const [activeTab, setActiveTab] = useState<'intake' | 'handover'>('intake')

  return (
    <StaffLayout>
      <div className="h-full overflow-y-auto p-4 sm:p-4 lg:p-6 min-h-screen sm:mx-4">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Processing History
          </h1>
        </div>

        {/* Custom Tabs Navigation matches image exactly */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('intake')}
              className={`pb-1 text-base font-medium transition-all hover:scale-[1.03] hover:drop-shadow-sm relative ${
                activeTab === 'intake' ? 'text-blue-600' : 'text-black'
              }`}
            >
              Intake
              {activeTab === 'intake' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('handover')}
              className={`pb-1 text-base font-medium transition-all hover:scale-[1.03] hover:drop-shadow-sm relative ${
                activeTab === 'handover' ? 'text-blue-600' : 'text-black'
              }`}
            >
              Return
              {activeTab === 'handover' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {activeTab === 'intake' ? <IntakeHistory /> : <HandoverHistory />}
      </div>
    </StaffLayout>
  )
}
