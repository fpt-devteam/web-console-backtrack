import type { ThresholdPoint } from '../types'

interface ConfusionMatrixProps {
  metrics: ThresholdPoint
}

interface CellConfig {
  value: number
  label: string
  description: string
  bg: string
  color: string
}

export function ConfusionMatrix({ metrics }: ConfusionMatrixProps) {
  const { TP, FP, TN, FN, threshold } = metrics

  const cells: [[CellConfig, CellConfig], [CellConfig, CellConfig]] = [
    [
      {
        value: TP,
        label: 'TP',
        description: 'True Positive',
        bg: 'bg-[#e8f9f0]',
        color: 'text-[#06c167]',
      },
      {
        value: FN,
        label: 'FN',
        description: 'False Negative',
        bg: 'bg-[#fff0f2]',
        color: 'text-[#c13515]',
      },
    ],
    [
      {
        value: FP,
        label: 'FP',
        description: 'False Positive',
        bg: 'bg-[#fff8e6]',
        color: 'text-[#c97a00]',
      },
      {
        value: TN,
        label: 'TN',
        description: 'True Negative',
        bg: 'bg-[#e8f9f0]',
        color: 'text-[#06c167]',
      },
    ],
  ]

  const rowLabels = ['Actual MATCH', 'Actual NO_MATCH']
  const colLabels = ['Predicted MATCH', 'Predicted NO_MATCH']

  return (
    <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#222222]">Confusion Matrix</h3>
        <p className="text-sm text-[#929292] mt-0.5">
          Predictions vs. ground truth at threshold {threshold}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-36" />
                {colLabels.map((label) => (
                  <th
                    key={label}
                    className="text-center text-xs font-semibold text-[#6a6a6a] px-6 py-2 whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row, ri) => (
                <tr key={rowLabels[ri]}>
                  <th className="text-right text-xs font-semibold text-[#6a6a6a] pr-3 py-2 whitespace-nowrap">
                    {rowLabels[ri]}
                  </th>
                  {row.map((cell) => (
                    <td
                      key={cell.label}
                      className={`${cell.bg} rounded-xl p-5 text-center min-w-[120px]`}
                    >
                      <p className={`text-4xl font-bold ${cell.color}`}>{cell.value}</p>
                      <p className={`text-xs font-semibold ${cell.color} mt-1`}>{cell.label}</p>
                      <p className="text-[11px] text-[#929292] mt-1">{cell.description}</p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
