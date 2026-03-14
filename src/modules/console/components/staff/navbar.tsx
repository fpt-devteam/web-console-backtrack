import { Package, FileText, MessageCircle, Bell, Building2 } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization } from '@/hooks/use-org'
import { useCurrentUser } from '@/hooks/use-auth'

const menuItems = [
  { name: 'Inventory', icon: Package, path: '/console/staff/inventory' },
  { name: 'Feed', icon: FileText, path: '/console/staff/feed' },
  { name: 'Chat', icon: MessageCircle, path: '/console/staff/chat' },
  { name: 'Notification', icon: Bell, path: '/console/staff/notification' },
]

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function StaffNavbar() {
  const location = useLocation()
  const { currentOrgId } = useCurrentOrgId()
  const { data: org } = useOrganization(currentOrgId)
  const { data: user } = useCurrentUser()

  const userInitials = getInitials(user?.name)
  const userDisplayName = user?.name || user?.email || 'User'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Org */}
          <div className="flex items-center gap-3">
            {org ? (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-gray-900 truncate max-w-[200px]" title={org.name}>
                  {org.name}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">Staff Portal</span>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex items-center h-16">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path}>
                  <button
                    className={`flex items-center gap-2 px-6 h-16 transition-all border-b-2 ${
                      isActive ? 'text-gray-900 border-blue-600' : 'text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </Link>
              )
            })}
          </div>

          {/* User: avatar + info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={userDisplayName}>
                {userDisplayName}
              </span>
              {org && (
                <span className="text-xs text-gray-500" title={org.displayAddress || org.slug}>
                  Staff · {org.slug}
                </span>
              )}
            </div>
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              title={userDisplayName}
            >
              {userInitials}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

