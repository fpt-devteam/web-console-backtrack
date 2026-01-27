import { 
  LayoutGrid, 
  Building2, 
  Users, 
  DollarSign, 
  Package, 
  Settings, 
  Shield, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Super Admin Sidebar Component
 * 
 * Displays navigation menu for super admin with branding section,
 * menu items, and user profile section at the bottom.
 * 
 * Features:
 * - Branding section with shield logo and portal information
 * - Navigation menu with active state highlighting
 * - User profile section with avatar and role information
 * - Toggle functionality to collapse/expand sidebar
 * 
 * @param isOpen - Whether sidebar is expanded
 * @param onToggle - Function to toggle sidebar state
 */
export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/super-admin/dashboard',
    },
    {
      name: 'Organization',
      icon: Building2,
      path: '/super-admin/organization',
    },
    {
      name: 'User Management',
      icon: Users,
      path: '/super-admin/users',
    },
    {
      name: 'Revenue Management',
      icon: DollarSign,
      path: '/super-admin/revenue',
    },
    {
      name: 'Service Package Management',
      icon: Package,
      path: '/super-admin/service-packages',
    },
    {
      name: 'Setting',
      icon: Settings,
      path: '/super-admin/setting',
    },
  ];

  /**
   * Checks if a menu item is currently active based on current route
   * 
   * @param path - Route path to check
   * @returns True if the path matches current location
   */
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Exact match
    if (currentPath === path) return true;
    
    // For User Management, also highlight when on related user pages
    if (path === '/super-admin/users') {
      if (currentPath.startsWith('/super-admin/users')) {
        return true;
      }
    }
    
    // For Revenue Management, also highlight when on related revenue pages
    if (path === '/super-admin/revenue') {
      if (currentPath.startsWith('/super-admin/revenue')) {
        return true;
      }
    }
    
    // For Service Package Management, also highlight when on related service pages
    if (path === '/super-admin/service-packages') {
      if (currentPath.startsWith('/super-admin/service-packages')) {
        return true;
      }
    }
    
    // For Organization, also highlight when on related organization pages
    if (path === '/super-admin/organization') {
      if (currentPath.startsWith('/super-admin/organization') ||
          currentPath.startsWith('/super-admin/add-tenant') ||
          currentPath.startsWith('/super-admin/edit-tenant')) {
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
      {/* Branding Section */}
      <div className="px-6 py-6 border-b border-gray-200 relative">
        <div className="flex items-center gap-3 mb-2">
          {/* Shield Logo */}
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <h1 className="font-bold text-lg  whitespace-nowrap">
              Admin Portal
            </h1>
          </div>
        </div>
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <p className="text-sm text-gray-500 whitespace-nowrap">
            System Management
          </p>
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
      <nav className="flex-1 py-6 overflow-y-auto">
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

      {/* User Profile Section */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div 
            className={`flex-1 transition-all duration-300 overflow-hidden ${
              isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <p className="font-medium  whitespace-nowrap">
              Alex Morgan
            </p>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

