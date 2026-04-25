import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { StaffSidebar } from './sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset className="bg-[#f7f7f7] min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
