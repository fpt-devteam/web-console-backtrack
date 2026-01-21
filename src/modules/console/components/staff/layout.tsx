import { StaffNavbar } from './navbar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      <StaffNavbar />
      <main className="flex-1 overflow-hidden overflow-y-auto">{children}</main>
    </div>
  )
}

