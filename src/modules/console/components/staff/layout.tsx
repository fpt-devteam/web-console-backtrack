import { useState } from 'react'
import { StaffSidebar } from './sidebar'

interface LayoutProps {
  children: React.ReactNode
  /** Defaults to true: allow page scroll within main. Set false to lock main scrolling (page can manage its own scroll areas). */
  mainScroll?: boolean
}

export function StaffLayout({ children = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <StaffSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className={`flex-1 min-h-0 overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {children}
      </main>
    </div>
  )
}

