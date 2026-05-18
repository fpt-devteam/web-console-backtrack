import { Layout } from '@/components/super-admin/layout'
import MatchingEvaluationTab from '@/components/super-admin/matching-evaluation/MatchingEvaluationTab'

export function MatchingEvaluationPage() {
  return (
    <Layout>
      <div className="bg-[#f7f7f7] min-h-screen">
        <MatchingEvaluationTab />
      </div>
    </Layout>
  )
}
