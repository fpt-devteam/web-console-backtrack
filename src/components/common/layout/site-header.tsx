import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface SiteCrumb {
  label: string
  href?: string
}

interface SiteHeaderProps {
  crumbs: SiteCrumb[]
  actions?: React.ReactNode
}

/**
 * Sticky top header bar matching the shadcn dashboard-01 pattern.
 * Renders SidebarTrigger (mobile/desktop toggle) + breadcrumb + optional right-side actions.
 * Must be used inside a SidebarProvider context.
 */
export function SiteHeader({ crumbs, actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-[#dddddd] bg-white px-4">
      <SidebarTrigger className="-ml-1 text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222]" />
      <Separator orientation="vertical" className="mx-1 h-4 bg-[#dddddd]" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.label}>
              {i > 0 && <BreadcrumbSeparator className="text-[#929292]" />}
              <BreadcrumbItem>
                {i < crumbs.length - 1 && crumb.href ? (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="text-[#6a6a6a] hover:text-[#222222] text-sm"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-[#222222] font-medium text-sm">
                    {crumb.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
