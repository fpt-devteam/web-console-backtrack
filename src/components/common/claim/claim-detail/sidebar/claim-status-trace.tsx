import { Check, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversationStatus } from '@/types/chat.types'
import { formatDateTime } from '@/utils/datetime.util'

interface ClaimStatusTraceProps {
  status: ConversationStatus
  submittedAt?: string | null
  resolvedAt?: string | null
}

type StepState = 'done' | 'active' | 'todo'

interface Step {
  label: string
  state: StepState
  time?: string | null
}

function buildSteps(status: ConversationStatus, submittedAt?: string | null, resolvedAt?: string | null): Step[] {
  const isQueue      = status === ConversationStatus.QUEUE
  const isInProgress = status === ConversationStatus.IN_PROGRESS
  const isClosed     = status === ConversationStatus.CLOSED

  return [
    {
      label: 'Submitted',
      state: isQueue ? 'active' : 'done',
      time: submittedAt ? formatDateTime(submittedAt) : null,
    },
    {
      label: 'In Review',
      state: isInProgress ? 'active' : isClosed ? 'done' : 'todo',
      time: null,
    },
    {
      label: 'Resolved',
      state: isClosed ? 'done' : 'todo',
      time: isClosed && resolvedAt ? formatDateTime(resolvedAt) : null,
    },
  ]
}

export function ClaimStatusTrace({ status, submittedAt, resolvedAt }: ClaimStatusTraceProps) {
  const steps = buildSteps(status, submittedAt, resolvedAt)

  return (
    <div className="flex flex-col gap-3">
      <span className="flex items-center gap-1.5 text-sm font-bold tracking-widest text-mute uppercase">
        <GitBranch className="w-5 h-5" />
        Status Trace
      </span>

      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3 relative">
            {i < steps.length - 1 && (
              <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-neutral-200" />
            )}
            <div className="shrink-0 z-10">
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white',
                step.state === 'done'   && 'border-green-500 bg-green-500',
                step.state === 'active' && 'border-rose-500 bg-rose-50',
                step.state === 'todo'   && 'border-neutral-200',
              )}>
                {step.state === 'done'   && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                {step.state === 'active' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                {step.state === 'todo'   && <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />}
              </div>
            </div>

            <div className="pb-4 min-w-0">
              <p className={cn(
                'text-sm font-medium leading-none mb-0.5',
                step.state === 'done'   && 'text-ink',
                step.state === 'active' && 'text-rose-600',
                step.state === 'todo'   && 'text-neutral-400',
              )}>
                {step.label}
              </p>
              {step.time && (
                <p className="text-xs text-mute">{step.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
