import {
  Package,
  ClipboardList,
  ArrowLeftRight,
  LogOut,
  ChevronsUpDown,
  LayoutDashboard,
  KanbanSquare,
} from 'lucide-react'
import { Link, useLocation, useParams } from '@tanstack/react-router'
import { OrgLogo } from '@/components/common/org/org-logo'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useOrganization } from '@/hooks/use-org'
import { useCurrentUser } from '@/hooks/use-auth'
import { appSignOut } from '@/lib/app-signout'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/core/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/core/dropdown-menu'

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const ITEM_CLS =
  'text-base text-charcoal hover:bg-neutral-200 data-[active=true]:bg-[#fff0f2] data-[active=true]:text-rausch'

const NAV_ITEMS = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    to: '/console/$slug/staff/dashboard' as const,
  },
  {
    key: 'inventory',
    name: 'Inventory',
    icon: Package,
    to: '/console/$slug/staff/inventory' as const,
  },
  {
    key: 'claim-board',
    name: 'Claim Board',
    icon: KanbanSquare,
    to: '/console/$slug/staff/claims' as const,
  },
  {
    key: 'assigned-claim',
    name: 'Assigned Claim',
    icon: ClipboardList,
    to: '/console/$slug/staff/assigned-claim' as const,
  },
]

function StaffSidebarInner() {
  const location = useLocation()
  const { slug: slugParam } = useParams({ strict: false })
  const { currentOrgId } = useCurrentOrgId()
  const { data: org } = useOrganization(currentOrgId)
  const { data: user } = useCurrentUser()

  const userInitials = getInitials(user?.name)
  const userDisplayName = user?.name || user?.email || 'User'

  // Resolved slug used only in isActive helpers (not in Link `to`)
  const slug = slugParam ?? org?.slug ?? ''
  const base = `/console/${slug}`

  const isActive = (key: string) => {
    const cur = location.pathname
    if (key === 'dashboard') return cur === `${base}/staff/dashboard` || cur === `${base}/staff`
    if (key === 'inventory') return cur.startsWith(`${base}/staff/inventory`)
    if (key === 'claim-board') return cur.startsWith(`${base}/staff/claims`)
    if (key === 'assigned-claim') return cur.startsWith(`${base}/staff/assigned-claim`)
    return false
  }

  return (
    <>
      {/* Header — org logo + name (dashboard-01 SidebarMenu pattern) */}
      <SidebarHeader className="py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={org?.name ?? 'Staff'}
              asChild
              className="hover:bg-neutral-200 text-ink"
            >
              <Link to="/console/$slug/staff/inventory" params={{ slug }}>
                <OrgLogo
                  logoUrl={org?.logoUrl}
                  alt={org?.name ?? 'Organization'}
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-md text-ink leading-tight" title={org?.name}>
                    {org?.name ?? 'Staff'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu className="px-3 gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.key)
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.name}
                  className={ITEM_CLS}
                >
                  <Link to={item.to} params={{ slug }}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer — user dropdown (NavUser pattern) */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userDisplayName}
                  className="text-ink hover:bg-neutral-200 data-[state=open]:bg-neutral-200"
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
                    <span className="text-sm text-mute">Staff</span>
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

export function StaffSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0! bg-cloud [&_[data-slot=sidebar-inner]]:bg-cloud">
      <StaffSidebarInner />
    </Sidebar>
  )
}
