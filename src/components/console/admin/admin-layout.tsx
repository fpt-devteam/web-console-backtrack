import { SidebarProvider, SidebarInset } from '@/components/common/core/sidebar'
import { AdminSidebar } from './admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-[#f7f7f7] min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
