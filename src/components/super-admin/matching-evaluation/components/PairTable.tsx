import { Fragment, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { TestPair } from '../types'

interface PairTableProps {
  pairs: TestPair[]
  threshold: number
}

type SortDir = 'asc' | 'desc'
type ResultLabel = 'TP' | 'FP' | 'TN' | 'FN'

function getPrediction(score: number, threshold: number): 'MATCH' | 'NO_MATCH' {
  return score >= threshold ? 'MATCH' : 'NO_MATCH'
}

function getResult(
  groundTruth: 'MATCH' | 'NO_MATCH',
  prediction: 'MATCH' | 'NO_MATCH',
): ResultLabel {
  if (groundTruth === 'MATCH' && prediction === 'MATCH') return 'TP'
  if (groundTruth === 'NO_MATCH' && prediction === 'MATCH') return 'FP'
  if (groundTruth === 'NO_MATCH' && prediction === 'NO_MATCH') return 'TN'
  return 'FN'
}

const RESULT_STYLE: Record<ResultLabel, string> = {
  TP: 'bg-[#e8f9f0] text-[#06c167]',
  TN: 'bg-[#e8f9f0] text-[#06c167]',
  FP: 'bg-[#fff8e6] text-[#c97a00]',
  FN: 'bg-[#fff0f2] text-[#c13515]',
}

const GT_STYLE: Record<string, string> = {
  MATCH: 'bg-[#e8f9f0] text-[#06c167]',
  NO_MATCH: 'bg-[#f7f7f7] text-[#6a6a6a]',
}

const GROUP_STYLE: Record<string, string> = {
  strong_match: 'bg-[#e8f9f0] text-[#06c167]',
  borderline: 'bg-[#fff8e6] text-[#c97a00]',
  no_match: 'bg-[#f7f7f7] text-[#6a6a6a]',
}

function toLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').trim()
}

export function PairTable({ pairs, threshold }: PairTableProps) {
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const sorted = [...pairs].sort((a, b) =>
    sortDir === 'desc' ? b.score - a.score : a.score - b.score,
  )

  const toggleRow = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#dddddd]">
        <h3 className="text-base font-semibold text-[#222222]">Test Pairs</h3>
        <p className="text-sm text-[#929292] mt-0.5">
          All {pairs.length} pairs — click any row to expand post details
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#dddddd]">
            <tr>
              <th className="px-4 py-3 w-8" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">Pair</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">Group</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">
                Category / Subcategory
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-[#929292] cursor-pointer select-none hover:text-[#222222] transition-colors whitespace-nowrap"
                onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
              >
                Score {sortDir === 'desc' ? '↓' : '↑'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">
                Ground Truth
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] whitespace-nowrap">
                Prediction @{threshold}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">Result</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292]">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {sorted.map((pair) => {
              const prediction = getPrediction(pair.score, threshold)
              const result = getResult(pair.groundTruth, prediction)
              const isExpanded = expanded.has(pair.id)
              const scoreBarColor = pair.groundTruth === 'MATCH' ? '#10B981' : '#EF4444'

              return (
                <Fragment key={pair.id}>
                  <tr
                    className="hover:bg-[#fafafa] transition-colors cursor-pointer"
                    onClick={() => toggleRow(pair.id)}
                  >
                    <td className="px-4 py-3 text-[#929292]">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-sm text-[#222222]">
                        {pair.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${GROUP_STYLE[pair.group]}`}
                      >
                        {pair.groupLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#222222]">{pair.category}</p>
                      <p className="text-xs text-[#929292]">{pair.subcategory}</p>
                    </td>
                    <td className="px-4 py-3 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[#222222] w-14 shrink-0">
                          {pair.score.toFixed(4)}
                        </span>
                        <div className="flex-1 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden min-w-[40px]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pair.score * 100}%`,
                              backgroundColor: scoreBarColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${GT_STYLE[pair.groundTruth]}`}
                      >
                        {pair.groundTruth}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${GT_STYLE[prediction]}`}
                      >
                        {prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${RESULT_STYLE[result]}`}
                      >
                        {result}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p
                        className="text-xs text-[#6a6a6a] truncate"
                        title={pair.note}
                      >
                        {pair.note}
                      </p>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={9} className="bg-[#fafafa] px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <PostCard title="Lost Post" fields={pair.lostPost} />
                          <PostCard title="Found Post" fields={pair.foundPost} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PostCard({ title, fields }: { title: string; fields: Record<string, string> }) {
  const entries = Object.entries(fields).filter(([, v]) => v !== '')
  return (
    <div>
      <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-white rounded-lg border border-[#dddddd] p-3 space-y-1.5">
        {entries.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-xs text-[#929292] capitalize shrink-0 min-w-[96px]">
              {toLabel(k)}:
            </span>
            <span className="text-xs text-[#222222]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
