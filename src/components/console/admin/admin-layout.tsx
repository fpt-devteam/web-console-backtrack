import { SidebarProvider, SidebarInset } from '@/components/common/core/sidebar'
import { AdminSidebar } from './admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider className="bg-cloud h-svh overflow-hidden">
      <AdminSidebar />
      <SidebarInset className="bg-white overflow-y-auto scrollbar-auto-hide md:my-2 md:rounded-xl md:shadow-md">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
