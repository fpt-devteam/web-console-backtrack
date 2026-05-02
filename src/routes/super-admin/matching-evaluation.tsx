import { createFileRoute } from '@tanstack/react-router'
import { MatchingEvaluationPage } from '@/modules/super-admin/pages/matching-evaluation'

export const Route = createFileRoute('/super-admin/matching-evaluation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MatchingEvaluationPage />
}
