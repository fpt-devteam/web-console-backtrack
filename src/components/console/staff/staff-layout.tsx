import { StaffSidebar } from './staff-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/common/core/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider className="bg-cloud h-svh overflow-hidden">
      <StaffSidebar />
      <SidebarInset className="bg-white overflow-y-auto scrollbar-auto-hide md:my-2 md:mr-2 md:rounded-xl md:shadow-md">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
