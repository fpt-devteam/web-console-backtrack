import { StaffSidebar } from './staff-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/common/core/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset className="min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
