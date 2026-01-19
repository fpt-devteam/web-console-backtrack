import { Package, FileText, MessageCircle, Bell } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import logo from '@/assets/logo.png';


const menuItems = [
  {
    name: 'Inventory',
    icon: Package,
    path: '/console/staff/inventory',
  },
  {
    name: 'Feed',
    icon: FileText,
    path: '/console/staff/feed',
  },
  {
    name: 'Chat',
    icon: MessageCircle,
    path: '/console/staff/chat',
  },
  {
    name: 'Notification',
    icon: Bell,
    path: '/console/staff/notification',
  },
]

export function StaffNavbar() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 justify-center">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            <span className="text-xl font-bold text-gray-900">
              Staff Portal
            </span>
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
                      isActive
                        ? 'text-gray-900 border-blue-600'
                        : 'text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </Link>
              )
            })}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <button className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Staff+User&background=10b981&color=fff"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

