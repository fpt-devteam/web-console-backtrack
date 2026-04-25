import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebar } from './sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-[#f7f7f7] min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
