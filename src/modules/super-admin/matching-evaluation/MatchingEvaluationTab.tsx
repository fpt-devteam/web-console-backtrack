import { useState } from 'react'
import { Info } from 'lucide-react'
import rawData from '../matching-evaluation.json'
import type { TestData } from './types'
import { ConfusionMatrix } from './components/ConfusionMatrix'
import { FormulaBreakdown } from './components/FormulaBreakdown'
import { MetricCards } from './components/MetricCards'
import { PairTable } from './components/PairTable'
import { ScoreDistributionChart } from './components/ScoreDistributionChart'
import { ThresholdCurveChart } from './components/ThresholdCurveChart'

const data = rawData as unknown as TestData

const DEFAULT_IDX = Math.max(
  0,
  data.thresholdAnalysis.findIndex((p) => p.threshold === data.meta.selectedThreshold),
)

export default function MatchingEvaluationTab() {
  const { meta, pairs, thresholdAnalysis } = data
  const [activeIdx, setActiveIdx] = useState(DEFAULT_IDX)

  const activePoint = thresholdAnalysis[activeIdx]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h2 className="text-xl font-bold text-[#222222]">Matching Threshold Evaluation</h2>
          <span className="rounded-full bg-[#fff0f2] text-[#ff385c] px-3 py-1 text-sm font-semibold whitespace-nowrap">
            Selected threshold: {meta.selectedThreshold}
          </span>
        </div>
        <p className="text-sm text-[#929292]">
          Cosine similarity threshold analysis for the lost-found matching algorithm ·{' '}
          {meta.distribution.totalPairs} test pairs ({meta.distribution.matchPairs} matches,{' '}
          {meta.distribution.noMatchPairs} non-matches)
        </p>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#f7f7f7] border border-[#dddddd] p-4">
          <Info className="w-4 h-4 text-[#6a6a6a] mt-0.5 shrink-0" />
          <p className="text-sm text-[#6a6a6a] leading-relaxed">{meta.thresholdRationale}</p>
        </div>
      </div>

      {/* Metric cards — live-update with slider */}
      <MetricCards
        activeMetrics={activePoint}
        totalPairs={meta.distribution.totalPairs}
      />

      {/* Charts — slider in ThresholdCurveChart drives everything */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ThresholdCurveChart
          data={thresholdAnalysis}
          selectedThreshold={meta.selectedThreshold}
          activeIdx={activeIdx}
          onActiveIdxChange={setActiveIdx}
        />
        <ScoreDistributionChart
          pairs={pairs}
          selectedThreshold={activePoint.threshold}
        />
      </div>

      {/* Test pair table */}
      <PairTable pairs={pairs} threshold={activePoint.threshold} />

      {/* Confusion matrix */}
      <ConfusionMatrix metrics={activePoint} />

      {/* Formula explanation */}
      <FormulaBreakdown metrics={activePoint} />
    </div>
  )
}
