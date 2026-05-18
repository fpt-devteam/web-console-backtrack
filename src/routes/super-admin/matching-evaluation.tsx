import { createFileRoute } from '@tanstack/react-router'
import { MatchingEvaluationPage } from '@/pages/super-admin/matching-evaluation'

export const Route = createFileRoute('/super-admin/matching-evaluation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MatchingEvaluationPage />
}
