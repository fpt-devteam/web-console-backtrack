import { useEffect } from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Forbidden } from '@/components/ui/errors/forbidden-page'
import { orgService } from '@/services/org.service'
import { ORG_KEYS } from '@/hooks/use-org'
import { persistActiveOrgIdForSession, requireSignedIn } from '@/lib/route-guards'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { ChatProvider } from '@/contexts/chat.context'
import type { Organization } from '@/types/organization.types'

export const Route = createFileRoute('/console/$slug')({
  beforeLoad: async ({ params, context }) => {
    const { slug } = params
    const { queryClient } = context

    await requireSignedIn(queryClient)

    const org: Organization = await queryClient.ensureQueryData({
      queryKey: ORG_KEYS.bySlug(slug),
      queryFn: () => orgService.getBySlug(slug),
      staleTime: 5 * 60 * 1000,
    })

    const myOrgs = await queryClient.ensureQueryData({
      queryKey: ORG_KEYS.myOrgs,
      queryFn: () => orgService.getMyOrgs(),
    })

    const membership = myOrgs.find((o) => o.orgId === org.id)
    if (!membership) {
      throw new Error('FORBIDDEN_ORG_NOT_MEMBER')
    }

    persistActiveOrgIdForSession(org.id)
    queryClient.setQueryData(ORG_KEYS.byId(org.id), org)

    return { currentOrg: org, membership }
  },
  errorComponent: Forbidden,
  component: OrgShell,
})

function OrgShell() {
  const { currentOrg } = Route.useRouteContext()
  const { setCurrentOrgId } = useCurrentOrgId()

  useEffect(() => {
    setCurrentOrgId(currentOrg.id)
  }, [currentOrg.id, setCurrentOrgId])

  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  )
}
