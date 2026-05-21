import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TimelineStepState = 'done' | 'active' | 'todo'
export type TimelineStepVariant = 'rose' | 'amber' | 'green' | 'blue' | 'slate'

export type TimelineStep = {
  id: string
  label: string
  timestamp?: string | null
  state: TimelineStepState
  variant?: TimelineStepVariant
}

const VARIANT: Record<TimelineStepVariant, {
  activeBorder: string
  activeBg: string
  activeRing: string
  activeDot: string
  doneBorder: string
  doneBg: string
  activeLabel: string
  connector: string
}> = {
  rose: {
    activeBorder: 'border-rose-500', activeBg: 'bg-rose-50', activeRing: 'ring-rose-100', activeDot: 'bg-rose-500',
    doneBorder: 'border-rose-500', doneBg: 'bg-rose-500',
    activeLabel: 'text-rose-600', connector: 'bg-rose-300',
  },
  amber: {
    activeBorder: 'border-amber-500', activeBg: 'bg-amber-50', activeRing: 'ring-amber-100', activeDot: 'bg-amber-500',
    doneBorder: 'border-amber-500', doneBg: 'bg-amber-500',
    activeLabel: 'text-amber-600', connector: 'bg-amber-300',
  },
  green: {
    activeBorder: 'border-emerald-500', activeBg: 'bg-emerald-50', activeRing: 'ring-emerald-100', activeDot: 'bg-emerald-500',
    doneBorder: 'border-emerald-500', doneBg: 'bg-emerald-500',
    activeLabel: 'text-emerald-600', connector: 'bg-emerald-300',
  },
  blue: {
    activeBorder: 'border-blue-500', activeBg: 'bg-blue-50', activeRing: 'ring-blue-100', activeDot: 'bg-blue-500',
    doneBorder: 'border-blue-500', doneBg: 'bg-blue-500',
    activeLabel: 'text-blue-600', connector: 'bg-blue-300',
  },
  slate: {
    activeBorder: 'border-slate-400', activeBg: 'bg-slate-50', activeRing: 'ring-slate-100', activeDot: 'bg-slate-400',
    doneBorder: 'border-slate-400', doneBg: 'bg-slate-400',
    activeLabel: 'text-slate-500', connector: 'bg-slate-300',
  },
}

function TimelineDot({
  step,
  isLast,
  onClick,
}: {
  step: TimelineStep
  isLast: boolean
  onClick?: (step: TimelineStep) => void
}) {
  const { state, variant = 'rose', label, timestamp } = step
  const isDone = state === 'done'
  const isActive = state === 'active'
  const c = VARIANT[variant]

  return (
    <div className="flex flex-col items-center">
      {/* Dot row: dot + connector line */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onClick ? () => onClick(step) : undefined}
          disabled={!onClick}
          aria-current={isActive ? 'step' : undefined}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
            isActive && `${c.activeBorder} ${c.activeBg} ring-4 ${c.activeRing} scale-110`,
            isDone && `${c.doneBorder} ${c.doneBg}`,
            !isActive && !isDone && 'border-gray-200 bg-white',
            onClick ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          {isActive && <span className={cn('h-3 w-3 rounded-full', c.activeDot)} />}
          {isDone && <Check className="h-4 w-4 text-white" strokeWidth={2.5} />}
          {!isActive && !isDone && <span className="h-2 w-2 rounded-full bg-gray-300" />}
        </button>

        {!isLast && (
          <div className={cn(
            'h-0.5 w-10 shrink-0 rounded-full sm:w-14 md:w-20',
            isDone ? c.connector : 'bg-gray-200',
          )} />
        )}
      </div>

      {/* Label + timestamp below the dot */}
      <div className="mt-2 flex flex-col items-center gap-0.5">
        <span className={cn(
          'whitespace-nowrap text-xs font-semibold',
          isActive ? c.activeLabel : isDone ? 'text-gray-700' : 'text-gray-400',
        )}>
          {label}
        </span>
        {timestamp && (
          <span className="whitespace-nowrap text-[11px] text-gray-400">{timestamp}</span>
        )}
      </div>
    </div>
  )
}

export function StatusTimeline({
  steps,
  onStepClick,
  className,
}: {
  steps: TimelineStep[]
  onStepClick?: (step: TimelineStep) => void
  className?: string
}) {
  return (
    <div className={cn(
      'flex items-start overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200',
      className,
    )}>
      {steps.map((step, i) => (
        <TimelineDot
          key={step.id}
          step={step}
          isLast={i === steps.length - 1}
          onClick={onStepClick}
        />
      ))}
    </div>
  )
}
