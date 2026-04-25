import {
  LayoutGrid,
  Building2,
  Users,
  DollarSign,
  Package,
  Shield,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { appSignOut } from '@/modules/auth/lib/app-signout'
import { useCurrentUser } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MENU_ITEM_CLS =
  'text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222] data-[active=true]:bg-[#fff0f2] data-[active=true]:text-[#ff385c]'

const navItems = [
  { name: 'Dashboard',                  icon: LayoutGrid, path: '/super-admin/dashboard' },
  { name: 'Organization',               icon: Building2,  path: '/super-admin/organization' },
  { name: 'User Management',            icon: Users,      path: '/super-admin/users' },
  { name: 'Revenue Management',         icon: DollarSign, path: '/super-admin/revenue' },
  { name: 'Service Package Management', icon: Package,    path: '/super-admin/service-packages' },
]

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'SA'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function isNavActive(path: string, currentPath: string) {
  if (currentPath === path) return true
  if (path !== '/super-admin/dashboard' && currentPath.startsWith(path)) return true
  return false
}

function SuperAdminSidebarInner() {
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const userInitials = getInitials(user?.name)
  const userDisplayName = user?.name || user?.email || 'Super Admin'

  return (
    <>
      {/* Header — branding (dashboard-01 SidebarMenu pattern) */}
      <SidebarHeader className="border-b border-[#dddddd]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Admin Portal"
              className="hover:bg-[#f7f7f7] text-[#222222] cursor-default"
            >
              <div className="w-8 h-8 bg-[#ff385c] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-[15px] text-[#222222] leading-tight">
                  Admin Portal
                </span>
                <span className="text-xs text-[#929292]">System Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarMenu className="px-3 gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isNavActive(item.path, location.pathname)
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.name}
                  className={MENU_ITEM_CLS}
                >
                  <Link to={item.path}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer — NavUser dropdown (dashboard-01 pattern) */}
      <SidebarFooter className="border-t border-[#dddddd]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userDisplayName}
                  className="text-[#222222] hover:bg-[#f7f7f7] data-[state=open]:bg-[#f7f7f7]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {userInitials}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-[#222222] truncate leading-tight">
                      {userDisplayName}
                    </span>
                    <span className="text-xs text-[#929292]">Super Admin</span>
                  </div>
                  <ChevronsUpDown className="ml-auto w-4 h-4 text-[#929292] flex-shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={4}
                className="w-56 rounded-xl"
              >
                <DropdownMenuLabel className="text-sm font-medium text-[#222222] truncate">
                  {userDisplayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void appSignOut()}
                  className="text-[#c13515] cursor-pointer focus:text-[#c13515] focus:bg-[#fff0f2]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </>
  )
}

export function SuperAdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-[#dddddd] bg-white">
      <SuperAdminSidebarInner />
    </Sidebar>
  )
}
