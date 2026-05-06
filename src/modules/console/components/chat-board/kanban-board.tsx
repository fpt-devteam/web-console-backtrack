import { useEffect, useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import toast from 'react-hot-toast'
import { KanbanColumn } from './kanban-column'
import { ConversationCard } from './conversation-card'
import { ConversationStatus } from '@/types/chat.types'
import type { IConversationWithStaff } from './mock-data'
import { MOCK_BOARD } from './mock-data'
import {
  useAssignConversation,
  useChatAssigned,
  useChatResolved,
  useResolveConversation,
  useReturnToQueue,
} from '@/hooks/use-chat'
import { useSocketChatQueue } from '@/hooks/use-chat-socket'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { useCurrentUser } from '@/hooks/use-auth'

const COLUMNS: { id: ConversationStatus; title: string; accent: string }[] = [
  { id: ConversationStatus.QUEUE,       title: 'Queue',       accent: 'bg-amber-400' },
  { id: ConversationStatus.IN_PROGRESS, title: 'In Progress', accent: 'bg-green-500' },
  { id: ConversationStatus.CLOSED,      title: 'Resolved',    accent: 'bg-neutral-400' },
]

type ColKey = ConversationStatus

interface BoardState {
  [ConversationStatus.QUEUE]:       IConversationWithStaff[]
  [ConversationStatus.IN_PROGRESS]: IConversationWithStaff[]
  [ConversationStatus.CLOSED]:      IConversationWithStaff[]
}

const VALID_TRANSITIONS: Partial<Record<ColKey, ColKey[]>> = {
  [ConversationStatus.QUEUE]:       [ConversationStatus.IN_PROGRESS],
  [ConversationStatus.IN_PROGRESS]: [ConversationStatus.QUEUE, ConversationStatus.CLOSED],
}

export function ChatKanbanBoard() {
  const { currentOrgId } = useCurrentOrgId()
  const { data: currentUser } = useCurrentUser()

  const { data: queueData, isLoading: isQueueLoading, removeFromQueue } = useSocketChatQueue(currentOrgId ?? undefined)
  const assignedQuery  = useChatAssigned()
  const resolvedQuery  = useChatResolved()

  const assignMutation  = useAssignConversation()
  const returnMutation  = useReturnToQueue()
  const resolveMutation = useResolveConversation()

  const [board, setBoard] = useState<BoardState>(MOCK_BOARD)
  const [draggingConv, setDraggingConv] = useState<IConversationWithStaff | null>(null)

  const isLoading = isQueueLoading || assignedQuery.isLoading || resolvedQuery.isLoading

  // Replace mock with real data once loaded
  useEffect(() => {
    const real = Array.isArray(queueData) ? queueData : []
    if (real.length === 0) return
    setBoard((prev) => ({ ...prev, [ConversationStatus.QUEUE]: real }))
  }, [queueData])

  useEffect(() => {
    const real = Array.isArray(assignedQuery.data) ? assignedQuery.data : []
    if (real.length === 0) return
    setBoard((prev) => ({ ...prev, [ConversationStatus.IN_PROGRESS]: real }))
  }, [assignedQuery.data])

  useEffect(() => {
    const real = Array.isArray(resolvedQuery.data) ? resolvedQuery.data : []
    if (real.length === 0) return
    setBoard((prev) => ({ ...prev, [ConversationStatus.CLOSED]: real }))
  }, [resolvedQuery.data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function findConv(id: string): { conv: IConversationWithStaff; col: ColKey } | null {
    for (const col of Object.values(ConversationStatus)) {
      const conv = board[col].find((c) => c.id === id)
      if (conv) return { conv, col: col as ColKey }
    }
    return null
  }

  function handleDragStart({ active }: DragStartEvent) {
    setDraggingConv(findConv(String(active.id))?.conv ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setDraggingConv(null)
    if (!over) return

    const convId    = String(active.id)
    const targetCol = over.id as ColKey
    const found     = findConv(convId)
    if (!found) return

    const { conv, col: sourceCol } = found
    if (sourceCol === targetCol) return

    const allowed = VALID_TRANSITIONS[sourceCol] ?? []
    if (!allowed.includes(targetCol)) {
      toast.error('That move is not allowed')
      return
    }

    const snapshot = { ...board }
    setBoard((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter((c) => c.id !== convId),
      [targetCol]: [{ ...conv, status: targetCol }, ...prev[targetCol]],
    }))

    const revert = () => setBoard(snapshot)

    if (sourceCol === ConversationStatus.QUEUE && targetCol === ConversationStatus.IN_PROGRESS) {
      removeFromQueue(convId)
      assignMutation.mutate(convId, {
        onError: () => { revert(); toast.error('Failed to assign conversation') },
      })
    } else if (sourceCol === ConversationStatus.IN_PROGRESS && targetCol === ConversationStatus.QUEUE) {
      returnMutation.mutate(convId, {
        onError: () => { revert(); toast.error('Failed to return conversation to queue') },
      })
    } else if (sourceCol === ConversationStatus.IN_PROGRESS && targetCol === ConversationStatus.CLOSED) {
      resolveMutation.mutate(convId, {
        onError: () => { revert(); toast.error('Failed to resolve conversation') },
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-x-auto">
        <div className="flex gap-4 pb-4 min-h-full">
          {COLUMNS.map(({ id, title, accent }) => {
            const draggable =
              id === ConversationStatus.QUEUE
                ? () => true
                : id === ConversationStatus.IN_PROGRESS
                  ? (conv: IConversationWithStaff) => conv.assignedStaffId === currentUser?.id
                  : () => false

            return (
              <KanbanColumn
                key={id}
                id={id}
                title={title}
                accent={accent}
                conversations={isLoading ? [] : board[id]}
                isLoading={isLoading}
                isCardDraggable={draggable}
              />
            )
          })}
        </div>
      </div>

      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {draggingConv && (
          <div className="w-96 shadow-2xl rotate-1">
            <ConversationCard conv={draggingConv} staffInfo={draggingConv.staffInfo} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
