import { StaffNavbar } from './navbar'

interface LayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavbar />
      <main>{children}</main>
    </div>
  )
}

