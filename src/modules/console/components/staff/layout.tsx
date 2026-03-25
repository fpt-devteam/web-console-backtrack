import { useState } from 'react'
import { StaffSidebar } from './sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className={`transition-all duration-300 overflow-y-auto ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {children}
      </main>
    </div>
  )
}

