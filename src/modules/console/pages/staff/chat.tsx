import { StaffLayout } from '../../components/staff/layout'

export function StaffChatPage() {
  return (
    <StaffLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600 mt-1">
            Communicate with team members
          </p>
        </div>

        {/* Content will be added here */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-500">Chat content coming soon...</p>
        </div>
      </div>
    </StaffLayout>
  )
}

