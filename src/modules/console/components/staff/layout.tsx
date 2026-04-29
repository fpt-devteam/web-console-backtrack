import { StaffSidebar } from './sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset className="bg-white min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
