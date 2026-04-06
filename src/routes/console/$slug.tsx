import { useEffect } from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { setActiveOrgId } from '@/lib/api-client'
import { orgService } from '@/services/org.service'
import { ORG_KEYS } from '@/hooks/use-org'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import type { Organization } from '@/types/organization.types'

export const Route = createFileRoute('/console/$slug')({
  beforeLoad: async ({ params, context }) => {
    const { slug } = params
    const { queryClient } = context

    const org: Organization = await queryClient.ensureQueryData({
      queryKey: ORG_KEYS.bySlug(slug),
      queryFn: () => orgService.getBySlug(slug),
      staleTime: 5 * 60 * 1000,
    })

    setActiveOrgId(org.id)
    queryClient.setQueryData(ORG_KEYS.byId(org.id), org)

    return { currentOrg: org }
  },
  component: OrgShell,
})

function OrgShell() {
  const { currentOrg } = Route.useRouteContext()
  const { setCurrentOrgId } = useCurrentOrgId()

  useEffect(() => {
    setCurrentOrgId(currentOrg.id)
  }, [currentOrg.id, setCurrentOrgId])

  return <Outlet />
}
