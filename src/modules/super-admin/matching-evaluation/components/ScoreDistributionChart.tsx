import {
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TestPair } from '../types'

interface ScoreDistributionChartProps {
  pairs: TestPair[]
  selectedThreshold: number
}

interface PlotPoint {
  x: number
  y: number
  id: string
  groundTruth: 'MATCH' | 'NO_MATCH'
}

const MATCH_COLOR = '#10B981'
const NO_MATCH_COLOR = '#EF4444'
const THRESHOLD_COLOR = '#ff385c'

function buildPlotPoints(pairs: TestPair[]): PlotPoint[] {
  const sorted = [...pairs].sort((a, b) => a.score - b.score)
  const result: PlotPoint[] = []
  const CLUSTER_GAP = 0.005

  let i = 0
  while (i < sorted.length) {
    const group: TestPair[] = [sorted[i]]
    while (
      i + group.length < sorted.length &&
      sorted[i + group.length].score - sorted[i].score < CLUSTER_GAP
    ) {
      group.push(sorted[i + group.length])
    }

    if (group.length === 1) {
      result.push({ x: group[0].score, y: 0, id: group[0].id, groundTruth: group[0].groundTruth })
    } else {
      const step = 1.2
      const start = -((group.length - 1) / 2) * step
      group.forEach((p, k) => {
        result.push({ x: p.score, y: start + k * step, id: p.id, groundTruth: p.groundTruth })
      })
    }

    i += group.length
  }

  return result
}

interface DotShapeProps {
  cx?: number
  cy?: number
  payload?: PlotPoint
}

function DotShape({ cx = 0, cy = 0, payload }: DotShapeProps) {
  if (!payload) return null
  const color = payload.groundTruth === 'MATCH' ? MATCH_COLOR : NO_MATCH_COLOR
  const labelAbove = payload.y >= 0
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={color} stroke="white" strokeWidth={2} />
      <text
        x={cx}
        y={labelAbove ? cy - 13 : cy + 19}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="#222222"
      >
        {payload.id}
      </text>
    </g>
  )
}

interface TooltipPayloadEntry {
  payload: PlotPoint
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null
  const p = payload[0].payload
  const color = p.groundTruth === 'MATCH' ? MATCH_COLOR : NO_MATCH_COLOR
  return (
    <div className="bg-white border border-[#dddddd] rounded-[10px] p-3 text-xs shadow-sm">
      <p className="font-semibold text-[#222222] mb-1.5">{p.id}</p>
      <p className="text-[#6a6a6a]">
        Score:{' '}
        <span className="font-mono font-semibold text-[#222222]">{p.x.toFixed(4)}</span>
      </p>
      <p className="text-[#6a6a6a]">
        Ground Truth:{' '}
        <span className="font-semibold" style={{ color }}>
          {p.groundTruth}
        </span>
      </p>
    </div>
  )
}

export function ScoreDistributionChart({ pairs, selectedThreshold }: ScoreDistributionChartProps) {
  const allPoints = buildPlotPoints(pairs)
  const matchPoints = allPoints.filter((p) => p.groundTruth === 'MATCH')
  const noMatchPoints = allPoints.filter((p) => p.groundTruth === 'NO_MATCH')

  const renderDot = (props: unknown) => {
    const { cx, cy, payload } = props as { cx: number; cy: number; payload: PlotPoint }
    return <DotShape cx={cx} cy={cy} payload={payload} />
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#222222]">Score Distribution</h3>
        <p className="text-sm text-[#929292] mt-0.5">
          Cosine similarity scores for all {pairs.length} test pairs vs. selected threshold
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 text-xs text-[#6a6a6a]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#10B981]" />
          MATCH
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#EF4444]" />
          NO_MATCH
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-5 border-t-2 border-dashed"
            style={{ borderColor: THRESHOLD_COLOR }}
          />
          Threshold ({selectedThreshold})
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 24, left: 8, bottom: 24 }}>
            <XAxis
              dataKey="x"
              type="number"
              name="Score"
              domain={[0.82, 1.0]}
              tick={{ fill: '#929292', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v.toFixed(2)}
              label={{
                value: 'Cosine Similarity Score',
                position: 'insideBottom',
                offset: -14,
                fill: '#929292',
                fontSize: 11,
              }}
              ticks={[0.84, 0.86, 0.88, 0.90, 0.92, 0.94, 0.96, 0.98, 1.0]}
            />
            <YAxis dataKey="y" type="number" hide domain={[-3.5, 3.5]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={selectedThreshold}
              stroke={THRESHOLD_COLOR}
              strokeDasharray="4 3"
              strokeWidth={2}
              label={{
                value: `θ=${selectedThreshold}`,
                position: 'top',
                fill: THRESHOLD_COLOR,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Scatter name="MATCH" data={matchPoints} shape={renderDot} />
            <Scatter name="NO_MATCH" data={noMatchPoints} shape={renderDot} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
