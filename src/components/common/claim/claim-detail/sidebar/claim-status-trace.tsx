import { Check, GitBranch, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversationStatus } from '@/types/chat.types'
import { formatDateTime } from '@/utils/datetime.util'

interface ClaimStatusTraceProps {
  status: ConversationStatus
  submittedAt?: string | null
  firstAssignedAt?: string | null
  verifiedAt?: string | null
  resolvedAt?: string | null
  rejectedAt?: string | null
}

type StepState = 'done' | 'active' | 'todo'

interface Step {
  label: string
  state: StepState
  time?: string | null
  /** Terminal "Rejected" outcome — rendered in rose with an ✕ instead of a green check. */
  rejected?: boolean
}

/**
 * Ordinal position of each status in the Queue → In Review → Verified → Closed flow.
 * Both terminal statuses (CLOSED → Resolved, REJECTED → Rejected) share the last step.
 */
const STATUS_ORDER: Record<ConversationStatus, number> = {
  [ConversationStatus.QUEUE]:       0,
  [ConversationStatus.IN_PROGRESS]: 1,
  [ConversationStatus.VERIFIED]:    2,
  [ConversationStatus.CLOSED]:      3,
  [ConversationStatus.REJECTED]:    3,
}

function stepState(current: number, step: number): StepState {
  if (current === step) return 'active'
  return current > step ? 'done' : 'todo'
}

function buildSteps(
  status: ConversationStatus,
  submittedAt?: string | null,
  firstAssignedAt?: string | null,
  verifiedAt?: string | null,
  resolvedAt?: string | null,
  rejectedAt?: string | null,
): Step[] {
  const current = STATUS_ORDER[status]
  const isRejected = status === ConversationStatus.REJECTED
  const isTerminal = current === 3

  return [
    {
      label: 'Submitted',
      // Submitted is complete the moment the claim leaves the queue.
      state: current === 0 ? 'active' : 'done',
      time: submittedAt ? formatDateTime(submittedAt) : null,
    },
    {
      label: 'In Review',
      state: stepState(current, 1),
      time: firstAssignedAt ? formatDateTime(firstAssignedAt) : null,
    },
    {
      // A rejected claim may skip verification — dim this step in that case.
      label: 'Verified',
      state: isRejected && !verifiedAt ? 'todo' : stepState(current, 2),
      time: verifiedAt ? formatDateTime(verifiedAt) : null,
    },
    {
      // Terminal step reflects the actual outcome: Resolved or Rejected.
      label: isRejected ? 'Rejected' : 'Resolved',
      state: isTerminal ? 'done' : 'todo',
      time: isRejected
        ? (rejectedAt ? formatDateTime(rejectedAt) : null)
        : (resolvedAt ? formatDateTime(resolvedAt) : null),
      rejected: isRejected,
    },
  ]
}

export function ClaimStatusTrace({ status, submittedAt, firstAssignedAt, verifiedAt, resolvedAt, rejectedAt }: ClaimStatusTraceProps) {
  const steps = buildSteps(status, submittedAt, firstAssignedAt, verifiedAt, resolvedAt, rejectedAt)

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
                step.state === 'done'   && !step.rejected && 'border-green-500 bg-green-500',
                step.state === 'done'   && step.rejected  && 'border-rose-500 bg-rose-500',
                step.state === 'active' && 'border-rose-500 bg-rose-50',
                step.state === 'todo'   && 'border-neutral-200',
              )}>
                {step.state === 'done'   && !step.rejected && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                {step.state === 'done'   && step.rejected  && <X className="w-3 h-3 text-white" strokeWidth={2.5} />}
                {step.state === 'active' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                {step.state === 'todo'   && <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />}
              </div>
            </div>

            <div className="pb-4 min-w-0">
              <p className={cn(
                'text-sm font-medium leading-none mb-0.5',
                step.state === 'done'   && !step.rejected && 'text-ink',
                step.state === 'done'   && step.rejected  && 'text-rose-600',
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
