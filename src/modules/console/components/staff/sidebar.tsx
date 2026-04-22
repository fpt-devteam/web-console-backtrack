import { Package, MessageCircle, Bell, ChevronLeft, ChevronRight, ArrowLeftRight, History } from 'lucide-react';
import { OrgLogo } from '@/components/org-logo';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { useOrganization } from '@/hooks/use-org';
import { useCurrentUser } from '@/hooks/use-auth';
import { LogoutPill } from '@/modules/auth/components/logout-pill';

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface StaffSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function StaffSidebar({ isOpen, onToggle }: StaffSidebarProps) {
  const location = useLocation();
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const { currentOrgId } = useCurrentOrgId();
  const { data: org } = useOrganization(currentOrgId);
  const { data: user } = useCurrentUser();
  const userInitials = getInitials(user?.name);
  const userDisplayName = user?.name || user?.email || 'User';

  const base = `/console/${slug ?? org?.slug ?? ''}`;

  const menuItems = [
    { name: 'Inventory', icon: Package, path: `${base}/staff/inventory` },
    { name: 'Chat', icon: MessageCircle, path: `${base}/staff/chat` },
    { name: 'History', icon: History, path: `${base}/staff/history` },
    { name: 'Notification', icon: Bell, path: `${base}/staff/notification` },
  ];

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    if (currentPath === path) return true;
    if (path === `${base}/staff/inventory`) {
      return (currentPath === path || currentPath.startsWith(`${base}/staff/inventory`) || currentPath.startsWith(`${base}/staff/item`)) && !currentPath.startsWith(`${base}/staff/history`);
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
          <OrgLogo logoUrl={org?.logoUrl} alt={org?.name ?? 'Organization'} className="h-10 w-10 flex-shrink-0" />
          <div className={`min-w-0 transition-all duration-300 ${isOpen ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            <h1 className="font-bold text-xl tracking-wide whitespace-nowrap truncate" title={org?.name}>
              {org?.name ?? 'Staff'}
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
                      : 'hover:bg-blue-50 hover:text-blue-600'
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
            <p className="text-xs text-gray-500 truncate">Staff</p>
          </div>
        )}
        <Link
          to="/console/welcome"
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0"
          title="change org"
        >
          <ArrowLeftRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-center">
        <LogoutPill isOpen={isOpen} />
      </div>
    </aside>
  );
}
