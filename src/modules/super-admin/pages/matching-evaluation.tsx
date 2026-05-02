import { Layout } from '../components/layout'
import MatchingEvaluationTab from '../matching-evaluation/MatchingEvaluationTab'

export function MatchingEvaluationPage() {
  return (
    <Layout>
      <div className="bg-[#f7f7f7] min-h-screen">
        <MatchingEvaluationTab />
      </div>
    </Layout>
  )
}
