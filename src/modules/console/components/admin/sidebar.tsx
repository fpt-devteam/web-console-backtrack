import {
  LayoutGrid,
  Users,
  CreditCard,
  Tag,
  Settings,
  Package,
  ArrowLeftRight,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react'
import { OrgLogo } from '@/components/org-logo'
import { Link, useLocation, useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization } from '@/hooks/use-org'
import { useCurrentUser } from '@/hooks/use-auth'
import { appSignOut } from '@/modules/auth/lib/app-signout'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MENU_ITEM_CLS =
  'text-base text-charcoal hover:bg-cloud data-[active=true]:bg-[#fff0f2] data-[active=true]:text-rausch'

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function AdminSidebarInner() {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const { slug: slugParam } = useParams({ strict: false }) as { slug?: string }
  const { currentOrgId } = useCurrentOrgId()
  const { data: org } = useOrganization(currentOrgId)
  const { data: user } = useCurrentUser()
  const userInitials = getInitials(user?.name)
  const userDisplayName = user?.name || user?.email || 'User'

  // Resolved slug for use in isActive helpers (not for Link `to` prop)
  const slug = slugParam ?? org?.slug ?? ''
  const base = `/console/${slug}`

  const settingSubPaths = useMemo(
    () => [
      `${base}/admin/setting`,
      `${base}/admin/setting/organization`,
      `${base}/admin/setting/organization/edit`,
      `${base}/account/security`,
    ],
    [base],
  )
  const isSettingActive = settingSubPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/'),
  )

  const isActive = (routeKey: string) => {
    const cur = location.pathname
    if (routeKey === 'dashboard') return cur === `${base}/admin/dashboard`
    if (routeKey === 'employee') return cur === `${base}/admin/employee`
    if (routeKey === 'plan') return cur === `${base}/admin/plan` || cur === `${base}/admin/edit-account`
    if (routeKey === 'pricing') return cur === `${base}/admin/pricing`
    if (routeKey === 'inventory') return cur === `${base}/admin/inventory` || cur.startsWith(`${base}/admin/inventory/`)
    return false
  }

  const isSettingChildActive = (routeKey: 'organization' | 'security') => {
    const cur = location.pathname
    if (routeKey === 'organization')
      return (
        cur === `${base}/admin/setting/organization` ||
        cur.startsWith(`${base}/admin/setting/organization/`)
      )
    if (routeKey === 'security') return cur === `${base}/account/security`
    return false
  }

  const navItems = [
    { key: 'dashboard', name: 'Dashboard', icon: LayoutGrid, to: '/console/$slug/admin/dashboard' as const },
    { key: 'employee',  name: 'Employee',  icon: Users,       to: '/console/$slug/admin/employee'  as const },
    { key: 'plan',      name: 'Plan',      icon: CreditCard,  to: '/console/$slug/admin/plan'      as const },
    { key: 'pricing',   name: 'Pricing',   icon: Tag,         to: '/console/$slug/admin/pricing'   as const },
    { key: 'inventory', name: 'Inventory', icon: Package,     to: '/console/$slug/admin/inventory' as const },
  ]

  return (
    <>
      {/* Header — org logo + name (dashboard-01 SidebarMenu pattern) */}
      <SidebarHeader className="border-b border-hairline py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={org?.name ?? 'Admin'}
              asChild
              className="hover:bg-cloud text-ink"
            >
              <Link to="/console/$slug/admin/dashboard" params={{ slug }}>
                <OrgLogo
                  logoUrl={org?.logoUrl}
                  alt={org?.name ?? 'Organization'}
                  className="h-11 w-11 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-semibold text-base text-ink leading-tight"
                    title={org?.name}
                  >
                    {org?.name ?? 'Admin'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="py-4">
        <SidebarMenu className="px-3 gap-0.5">
          {/* Plain nav items */}
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.key)
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.name}
                  className={MENU_ITEM_CLS}
                >
                  <Link to={item.to} params={{ slug }}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}

          {/* Setting with collapsible sub-menu */}
          {isCollapsed ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isSettingActive}
                tooltip="Setting"
                className={MENU_ITEM_CLS}
              >
                <Link to="/console/$slug/admin/setting/organization" params={{ slug }}>
                  <Settings />
                  <span>Setting</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <Collapsible defaultOpen={isSettingActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isSettingActive}
                    tooltip="Setting"
                    className={`${MENU_ITEM_CLS} justify-between`}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Setting</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-60 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isSettingChildActive('organization')}
                        className="text-base text-ash hover:bg-cloud hover:text-ink data-[active=true]:bg-[#fff0f2] data-[active=true]:text-rausch"
                      >
                        <Link to="/console/$slug/admin/setting/organization" params={{ slug }}>
                          <ChevronRight className="w-3 h-3 opacity-40" />
                          <span>Organization Info</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isSettingChildActive('security')}
                        className="text-base text-ash hover:bg-cloud hover:text-ink data-[active=true]:bg-[#fff0f2] data-[active=true]:text-rausch"
                      >
                        <Link to="/console/$slug/account/security" params={{ slug }}>
                          <ChevronRight className="w-3 h-3 opacity-40" />
                          <span>Security</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer — NavUser dropdown (dashboard-01 pattern) */}
      <SidebarFooter className="border-t border-[#dddddd] py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userDisplayName}
                  className="text-[#222222] hover:bg-[#f7f7f7] data-[state=open]:bg-[#f7f7f7]"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={userDisplayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {userInitials}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-base font-medium text-ink truncate leading-tight">
                      {userDisplayName}
                    </span>
                    <span className="text-sm text-mute">Admin</span>
                  </div>
                  <ChevronsUpDown className="ml-auto w-4 h-4 text-[#929292] flex-shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={16}
                className="w-56 rounded-xl border-hairline"
              >
                <DropdownMenuLabel className="text-sm font-medium text-[#222222] truncate">
                  {userDisplayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/console/welcome" className="cursor-pointer">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Change Organization
                  </Link>
                </DropdownMenuItem>
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

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-[#dddddd] bg-white">
      <AdminSidebarInner />
      <SidebarRail />
    </Sidebar>
  )
}
