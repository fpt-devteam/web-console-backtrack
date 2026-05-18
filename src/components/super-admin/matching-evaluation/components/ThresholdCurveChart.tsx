import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { ThresholdPoint } from '../types'

interface ThresholdCurveChartProps {
  data: ThresholdPoint[]
  selectedThreshold: number
  activeIdx: number
  onActiveIdxChange: (idx: number) => void
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

export function ThresholdCurveChart({
  data,
  selectedThreshold,
  activeIdx,
  onActiveIdxChange,
}: ThresholdCurveChartProps) {
  const chartData = data.map((d) => ({
    threshold: d.threshold.toFixed(2),
    F1: +(d.f1 * 100).toFixed(1),
    Precision: +(d.precision * 100).toFixed(1),
    Recall: +(d.recall * 100).toFixed(1),
  }))

  const activePoint = data[activeIdx]!
  const activeLabel = activePoint.threshold.toFixed(2)
  const selectedLabel = selectedThreshold.toFixed(2)
  const isAtSelected = activeLabel === selectedLabel

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#222222]">Threshold vs. Metrics</h3>
        <p className="text-sm text-[#929292] mt-0.5">
          How F1, Precision, and Recall change across thresholds
        </p>
      </div>

      {/* Chart area with metrics panel overlay */}
      <div className="relative h-72 w-full">
        {/* Live metrics panel — top-left overlay */}
        <div className="absolute top-2 left-2 z-10 bg-white/95 border border-[#dddddd] rounded-lg px-3 py-2.5 text-xs shadow-sm pointer-events-none select-none">
          <p className="font-semibold text-[#222222] mb-1.5">
            Threshold: {activeLabel}
          </p>
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff385c] shrink-0" />
              <span className="text-[#6a6a6a] w-14">F1</span>
              <span className="font-semibold text-[#ff385c] ml-auto">{pct(activePoint.f1)}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0" />
              <span className="text-[#6a6a6a] w-14">Precision</span>
              <span className="font-semibold text-[#3B82F6] ml-auto">{pct(activePoint.precision)}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-[#6a6a6a] w-14">Recall</span>
              <span className="font-semibold text-[#10B981] ml-auto">{pct(activePoint.recall)}</span>
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="threshold"
              tick={{ fill: '#929292', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fill: '#929292', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 110]}
              width={44}
            />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 13 }} iconType="circle" />

            {/* Original selected threshold — shown dimmer when slider moves away */}
            {!isAtSelected && (
              <ReferenceLine
                x={selectedLabel}
                stroke="#c1c1c1"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: 'Selected',
                  position: 'top',
                  fill: '#c1c1c1',
                  fontSize: 10,
                }}
              />
            )}

            {/* Active threshold — driven by slider */}
            <ReferenceLine
              x={activeLabel}
              stroke="#ff385c"
              strokeDasharray="4 3"
              strokeWidth={2}
              label={{
                value: isAtSelected ? 'Selected' : activeLabel,
                position: 'top',
                fill: '#ff385c',
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <Line
              type="monotone"
              dataKey="F1"
              stroke="#ff385c"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ff385c' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Precision"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3B82F6' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Recall"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10B981' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Threshold slider */}
      <div className="mt-5 px-1">
        <div className="flex items-center justify-between text-xs text-[#929292] mb-2">
          <span>{data[0]!.threshold.toFixed(2)}</span>
          <span className="font-semibold text-[#222222]">
            θ = {activeLabel}
            {isAtSelected && (
              <span className="ml-1.5 font-normal text-[#ff385c]">(selected)</span>
            )}
          </span>
          <span>{data[data.length - 1]!.threshold.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={data.length - 1}
          step={1}
          value={activeIdx}
          onChange={(e) => onActiveIdxChange(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: '#ff385c' }}
        />
      </div>
    </div>
  )
}
