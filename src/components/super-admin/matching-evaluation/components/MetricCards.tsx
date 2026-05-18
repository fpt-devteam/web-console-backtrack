import { BarChart2, Hash, Target, Zap } from 'lucide-react'
import type { ThresholdPoint } from '../types'

interface MetricCardsProps {
  activeMetrics: ThresholdPoint
  totalPairs: number
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

export function MetricCards({ activeMetrics: m, totalPairs }: MetricCardsProps) {
  const isPerfectRecall = m.recall === 1.0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Precision */}
      <div className="bg-white rounded-[14px] border border-[#dddddd] p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="rounded-lg bg-[#eff6ff] p-2.5">
            <Target className="h-5 w-5 text-[#3B82F6]" />
          </span>
          <span className="text-xs font-medium text-[#929292]">@θ={m.threshold.toFixed(2)}</span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Precision</p>
        <p className="mt-1 text-3xl font-bold text-[#222222]">{pct(m.precision)}</p>
        <p className="mt-2 text-xs text-[#929292]">
          {m.TP} correct of {m.TP + m.FP} predicted matches
        </p>
      </div>

      {/* Recall — highlight when perfect (FN = 0) */}
      <div
        className={`bg-white rounded-[14px] p-5 transition-all ${
          isPerfectRecall ? 'border-2 border-[#10B981]' : 'border border-[#dddddd]'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="rounded-lg bg-[#e8f9f0] p-2.5">
            <Zap className="h-5 w-5 text-[#06c167]" />
          </span>
          {isPerfectRecall && (
            <span className="rounded-full bg-[#e8f9f0] text-[#06c167] px-2 py-0.5 text-xs font-semibold">
              Priority metric
            </span>
          )}
        </div>
        <p className="text-sm text-[#6a6a6a]">Recall</p>
        <p
          className={`mt-1 text-3xl font-bold transition-colors ${
            isPerfectRecall ? 'text-[#06c167]' : 'text-[#222222]'
          }`}
        >
          {pct(m.recall)}
        </p>
        <p className="mt-2 text-xs text-[#929292]">
          {m.FN} true {m.FN === 1 ? 'match' : 'matches'} missed (FN = {m.FN})
        </p>
      </div>

      {/* F1 Score */}
      <div className="bg-white rounded-[14px] border border-[#dddddd] p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="rounded-lg bg-[#fff0f2] p-2.5">
            <BarChart2 className="h-5 w-5 text-[#ff385c]" />
          </span>
          <span className="text-xs font-medium text-[#929292]">@θ={m.threshold.toFixed(2)}</span>
        </div>
        <p className="text-sm text-[#6a6a6a]">F1 Score</p>
        <p className="mt-1 text-3xl font-bold text-[#222222]">{pct(m.f1)}</p>
        <p className="mt-2 text-xs text-[#929292]">Harmonic mean of precision &amp; recall</p>
      </div>

      {/* Confusion counts */}
      <div className="bg-white rounded-[14px] border border-[#dddddd] p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="rounded-lg bg-[#f7f7f7] p-2.5">
            <Hash className="h-5 w-5 text-[#6a6a6a]" />
          </span>
          <span className="text-xs font-medium text-[#929292]">{totalPairs} pairs</span>
        </div>
        <p className="text-sm text-[#6a6a6a]">Confusion Counts</p>
        <p className="mt-1 text-2xl font-bold text-[#222222] font-mono">
          {m.TP} / {m.FP} / {m.TN} / {m.FN}
        </p>
        <p className="mt-2 text-xs text-[#929292]">TP &nbsp;/&nbsp; FP &nbsp;/&nbsp; TN &nbsp;/&nbsp; FN</p>
      </div>
    </div>
  )
}
