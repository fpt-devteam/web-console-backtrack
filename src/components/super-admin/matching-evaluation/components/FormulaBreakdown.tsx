import type { ThresholdPoint } from '../types'

interface FormulaBreakdownProps {
  metrics: ThresholdPoint
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

interface FractionProps {
  numerator: React.ReactNode
  denominator: React.ReactNode
  color?: string
}

function Fraction({ numerator, denominator, color = '#222222' }: FractionProps) {
  return (
    <div className="inline-flex flex-col items-center gap-0.5 font-mono text-sm">
      <span style={{ color }}>{numerator}</span>
      <span className="w-full border-t border-current" style={{ borderColor: color }} />
      <span style={{ color }}>{denominator}</span>
    </div>
  )
}

function Eq() {
  return <span className="text-[#929292] text-base mx-2">=</span>
}

function Times() {
  return <span className="text-[#929292] text-base mx-1">×</span>
}

interface MetricRowProps {
  label: string
  color: string
  bg: string
  result: string
  formula: React.ReactNode
  substituted: React.ReactNode
  description: string
}

function MetricRow({ label, color, bg, result, formula, substituted, description }: MetricRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 first:pt-0 last:pb-0">
      {/* Label */}
      <div className="sm:w-28 shrink-0">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: bg, color }}
        >
          {label}
        </span>
        <p className="mt-1.5 text-[11px] text-[#929292] leading-tight">{description}</p>
      </div>

      {/* Formula chain */}
      <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
        {/* Abstract formula */}
        <div className="text-[#929292]">{formula}</div>

        <Eq />

        {/* Substituted numbers */}
        <div style={{ color }}>{substituted}</div>

        <Eq />

        {/* Result */}
        <span className="text-lg font-bold" style={{ color }}>
          {result}
        </span>
      </div>
    </div>
  )
}

export function FormulaBreakdown({ metrics: m }: FormulaBreakdownProps) {
  const f1Denominator = m.precision + m.recall

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#222222]">How Metrics Are Calculated</h3>
        <p className="text-sm text-[#929292] mt-0.5">
          Formulas with live values at θ = {m.threshold.toFixed(2)}
        </p>
      </div>

      <div className="divide-y divide-[#f0f0f0]">
        {/* Precision */}
        <MetricRow
          label="Precision"
          color="#3B82F6"
          bg="#eff6ff"
          result={pct(m.precision)}
          description="Of all predicted matches, how many are correct?"
          formula={
            <Fraction
              numerator="TP"
              denominator="TP + FP"
              color="#929292"
            />
          }
          substituted={
            <Fraction
              numerator={m.TP}
              denominator={`${m.TP} + ${m.FP}`}
              color="#3B82F6"
            />
          }
        />

        {/* Recall */}
        <MetricRow
          label="Recall"
          color="#10B981"
          bg="#e8f9f0"
          result={pct(m.recall)}
          description="Of all real matches, how many did we catch?"
          formula={
            <Fraction
              numerator="TP"
              denominator="TP + FN"
              color="#929292"
            />
          }
          substituted={
            <Fraction
              numerator={m.TP}
              denominator={`${m.TP} + ${m.FN}`}
              color="#10B981"
            />
          }
        />

        {/* F1 */}
        <MetricRow
          label="F1 Score"
          color="#ff385c"
          bg="#fff0f2"
          result={pct(m.f1)}
          description="Harmonic mean — balances precision and recall."
          formula={
            <Fraction
              numerator={
                <span className="flex items-center gap-1">
                  <span>2</span>
                  <Times />
                  <span>Precision</span>
                  <Times />
                  <span>Recall</span>
                </span>
              }
              denominator="Precision + Recall"
              color="#929292"
            />
          }
          substituted={
            <Fraction
              numerator={
                <span className="flex items-center gap-1">
                  <span>2</span>
                  <Times />
                  <span>{pct(m.precision)}</span>
                  <Times />
                  <span>{pct(m.recall)}</span>
                </span>
              }
              denominator={`${pct(m.precision)} + ${pct(m.recall)} = ${(f1Denominator * 100).toFixed(1)}%`}
              color="#ff385c"
            />
          }
        />
      </div>

      {/* Confusion matrix legend */}
      <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
        <p className="text-xs font-semibold text-[#929292] uppercase tracking-wide mb-3">
          Term definitions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { abbr: 'TP', full: 'True Positive', detail: 'Predicted MATCH, actually MATCH', color: '#06c167', bg: '#e8f9f0' },
            { abbr: 'FP', full: 'False Positive', detail: 'Predicted MATCH, actually NO_MATCH', color: '#c97a00', bg: '#fff8e6' },
            { abbr: 'TN', full: 'True Negative', detail: 'Predicted NO_MATCH, actually NO_MATCH', color: '#06c167', bg: '#e8f9f0' },
            { abbr: 'FN', full: 'False Negative', detail: 'Predicted NO_MATCH, actually MATCH', color: '#c13515', bg: '#fff0f2' },
          ].map(({ abbr, full, detail, color, bg }) => (
            <div key={abbr} className="rounded-lg p-3" style={{ backgroundColor: bg }}>
              <p className="text-sm font-bold" style={{ color }}>{abbr}</p>
              <p className="text-xs font-semibold text-[#222222] mt-0.5">{full}</p>
              <p className="text-[11px] text-[#929292] mt-0.5 leading-tight">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
