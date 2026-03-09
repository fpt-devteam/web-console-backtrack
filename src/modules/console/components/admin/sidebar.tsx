import { LayoutGrid, Users, CreditCard, Building2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { useOrganization } from '@/hooks/use-org';
import { useCurrentUser } from '@/hooks/use-auth';

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { currentOrgId } = useCurrentOrgId();
  const { data: org } = useOrganization(currentOrgId);
  const { data: user } = useCurrentUser();
  const userInitials = getInitials(user?.name);
  const userDisplayName = user?.name || user?.email || 'User';

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

    // For Setting menu, also highlight when on organization or security
    if (path === '/console/admin/setting') {
      if (currentPath === '/console/admin/setting' ||
          currentPath === '/console/admin/setting/organization' ||
          currentPath === '/console/admin/setting/security') {
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
      {/* Header: Org + Toggle */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-gray-200 relative">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className={`min-w-0 transition-all duration-300 ${isOpen ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            <h1 className="font-bold text-xl tracking-wide whitespace-nowrap truncate" title={org?.name}>
              {org?.name ?? 'Admin'}
            </h1>
            {org && isOpen && (
              <p className="text-xs text-gray-500 truncate" title={org.slug}>{org.slug}</p>
            )}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md p-1 hover:bg-gray-100 transition-all z-10"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
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

      {/* User info */}
      <div
        className={`border-t border-gray-200 px-4 py-3 flex items-center gap-3 min-w-0 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 overflow-hidden justify-center'
        }`}
      >
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
          title={userDisplayName}
        >
          {userInitials}
        </div>
        {isOpen && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate" title={userDisplayName}>{userDisplayName}</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        )}
      </div>

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

