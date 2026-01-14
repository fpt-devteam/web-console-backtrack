import { LayoutGrid, Users, CreditCard, Building2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/console/admin/dashboard',
    },
    {
      name: 'Employee',
      icon: Users,
      path: '/console/admin/employee',
    },
    {
      name: 'Plan',
      icon: CreditCard,
      path: '/console/admin/plan',
    },
    {
      name: 'Branch',
      icon: Building2,
      path: '/console/admin/branch',
    },
    {
      name: 'Setting',
      icon: Settings,
      path: '/console/admin/setting',
    },
  ];

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Exact match
    if (currentPath === path) return true;
    
    // For Employee menu, also highlight when on related employee pages
    if (path === '/console/admin/employee') {
      // Check if current path is any employee-related page
      if (currentPath === '/console/admin/employee' || 
          currentPath === '/console/admin/invite-employee') {
        return true;
      }
    }
    
    // For Plan menu, also highlight when on edit-account page
    if (path === '/console/admin/plan') {
      if (currentPath === '/console/admin/plan' || 
          currentPath === '/console/admin/edit-account') {
        return true;
      }
    }
    
    return false;
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header/Logo & Toggle */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-gray-200 relative">
        {/* Avatar/Logo */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 
            className={`font-bold text-xl tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            Admin
          </h1>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md p-1 hover:bg-gray-100 transition-all z-10"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                      : ' hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span 
                    className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                      isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div 
        className={`px-6 py-4 border-t border-gray-200 text-xs text-gray-400 transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
        }`}
      >
        © 2025 Backtrack
      </div>
    </aside>
  );
}

