import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SuperAdminSidebar } from './sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <SuperAdminSidebar />
      <SidebarInset className="bg-[#f7f7f7] min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
