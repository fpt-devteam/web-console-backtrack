import { Check } from 'lucide-react'
import type { InventoryItem } from '@/services/inventory.service'
import { SectionTitle } from './inventory-detail-primitives'

type StepVariant = 'rose' | 'amber' | 'slate'

const VARIANT_COLORS: Record<StepVariant, {
  activeBorder: string; activeBg: string; activeRing: string; activeDot: string
  doneBorder: string; doneBg: string
  activeText: string
  line: string
}> = {
  rose: {
    activeBorder: 'border-rose-500', activeBg: 'bg-rose-50', activeRing: 'ring-rose-100', activeDot: 'bg-rose-500',
    doneBorder: 'border-rose-500', doneBg: 'bg-rose-500',
    activeText: 'text-rose-600',
    line: 'bg-rose-500',
  },
  amber: {
    activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', activeRing: 'ring-amber-100', activeDot: 'bg-amber-500',
    doneBorder: 'border-amber-500', doneBg: 'bg-amber-500',
    activeText: 'text-amber-600',
    line: 'bg-amber-500',
  },
  slate: {
    activeBorder: 'border-slate-400', activeBg: 'bg-slate-50', activeRing: 'ring-slate-100', activeDot: 'bg-slate-400',
    doneBorder: 'border-slate-400', doneBg: 'bg-slate-400',
    activeText: 'text-slate-500',
    line: 'bg-slate-400',
  },
}

function VerticalStep({
  state,
  label,
  date,
  disabled = false,
  variant = 'rose',
  isLast = false,
  onClick,
}: {
  state: 'done' | 'active' | 'todo'
  label: string
  date: string
  disabled?: boolean
  variant?: StepVariant
  isLast?: boolean
  onClick?: () => void
}) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  const c = VARIANT_COLORS[variant]

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={['flex w-full items-stretch gap-3 text-left', disabled ? 'cursor-default' : 'cursor-pointer'].join(' ')}
      aria-current={isActive ? 'step' : undefined}
    >
      <div className="flex flex-col items-center">
        <span className={[
          'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0',
          isActive ? `${c.activeBorder} ${c.activeBg} ring-4 ${c.activeRing}`
            : isDone ? `${c.doneBorder} ${c.doneBg}`
              : 'border-gray-200 bg-white',
        ].join(' ')}>
          {isActive
            ? <span className={`w-3 h-3 rounded-full ${c.activeDot}`} />
            : isDone
              ? <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              : <span className="w-2 h-2 rounded-full bg-gray-300" />}
        </span>
        {!isLast && <span className={`my-1 w-0.5 flex-1 rounded-full ${isDone ? c.line : 'bg-gray-200'}`} />}
      </div>
      <div className={`min-w-0 pt-1 ${isLast ? '' : 'pb-5'}`}>
        <p className={`text-sm font-semibold ${isActive ? c.activeText : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
          {label}
        </p>
        <p className="text-[11px] text-gray-400 break-words">{date}</p>
      </div>
    </button>
  )
}

export function InventoryProgressStepper({
  status,
  activeStep,
  onStepChange,
  intakeAt,
  terminalAt,
  returnedDate,
}: {
  status: InventoryItem['status']
  activeStep: number
  onStepChange: (step: number) => void
  intakeAt: string
  terminalAt: string
  returnedDate: string
}) {
  return (
    <div>
      <SectionTitle title="Progress" />
      <div className="mt-2 rounded-xl px-4 py-4">
        <VerticalStep
          state={activeStep === 0 ? 'active' : 'done'}
          label="In Storage"
          date={intakeAt}
          variant="rose"
          onClick={() => onStepChange(0)}
        />
        {status === 'Archived' ? (
          <VerticalStep
            state={activeStep === 3 ? 'active' : 'done'}
            label="Archived"
            date={terminalAt}
            variant="amber"
            isLast
            onClick={() => onStepChange(3)}
          />
        ) : status === 'Expired' ? (
          <VerticalStep
            state={activeStep === 4 ? 'active' : 'done'}
            label="Expired"
            date={terminalAt}
            variant="slate"
            isLast
            onClick={() => onStepChange(4)}
          />
        ) : (
          <VerticalStep
            state={status === 'Returned' ? (activeStep === 2 ? 'active' : 'done') : 'todo'}
            label="Returned"
            date={status === 'Returned' ? returnedDate : '—'}
            variant="rose"
            disabled={status !== 'Returned'}
            isLast
            onClick={() => onStepChange(2)}
          />
        )}
      </div>
    </div>
  )
}
