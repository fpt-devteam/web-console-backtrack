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
import { ClaimColumn } from './claim-column'
import { ClaimCard } from '../claim-card/claim-card'
import { ConversationStatus } from '@/types/chat.types'
import { COLUMNS, VALID_TRANSITIONS } from './claim-board.constants'
import { findConv, isCardDraggable } from './claim-board.helper'
import { ClaimAssignDialog } from '../claim-dialog/claim-assign-dialog'
import { ClaimResolveDialog } from '../claim-dialog/claim-resolve-dialog'
import type { BoardState, ColKey } from './claim-board.types'
import type { IConversation } from '@/types/chat.types'

interface ClaimBoardProps {
  queueConversations: IConversation[]
  assignedConversations: IConversation[]
  resolvedConversations: IConversation[]
  isLoading: boolean
  currentUserId?: string
  isAssignPending: boolean
  isResolvePending: boolean
  onAssign: (convId: string) => Promise<void>
  onResolve: (convId: string) => Promise<void>
  onRemoveFromQueue: (convId: string) => void
  onOpenConversation?: (conv: IConversation) => void
}

export function ClaimBoard({
  queueConversations,
  assignedConversations,
  resolvedConversations,
  isLoading,
  currentUserId,
  isAssignPending,
  isResolvePending,
  onAssign,
  onResolve,
  onRemoveFromQueue,
  onOpenConversation,
}: ClaimBoardProps) {
  const [board, setBoard] = useState<BoardState>({
    [ConversationStatus.QUEUE]: queueConversations,
    [ConversationStatus.IN_PROGRESS]: assignedConversations,
    [ConversationStatus.CLOSED]: resolvedConversations,
  })
  const [draggingConv, setDraggingConv] = useState<IConversation | null>(null)
  const [pendingAssign, setPendingAssign] = useState<IConversation | null>(null)
  const [pendingResolve, setPendingResolve] = useState<IConversation | null>(null)

  useEffect(() => {
    setBoard((prev) => ({ ...prev, [ConversationStatus.QUEUE]: queueConversations }))
  }, [queueConversations])

  useEffect(() => {
    setBoard((prev) => ({ ...prev, [ConversationStatus.IN_PROGRESS]: assignedConversations }))
  }, [assignedConversations])

  useEffect(() => {
    setBoard((prev) => ({ ...prev, [ConversationStatus.CLOSED]: resolvedConversations }))
  }, [resolvedConversations])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragStart({ active }: DragStartEvent) {
    setDraggingConv(findConv(board, String(active.id))?.conv ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setDraggingConv(null)
    if (!over) return

    const convId    = String(active.id)
    const targetCol = over.id as ColKey
    const found     = findConv(board, convId)
    if (!found) return

    const { conv, col: sourceCol } = found
    if (sourceCol === targetCol) return

    const allowed = VALID_TRANSITIONS[sourceCol] ?? []
    if (!allowed.includes(targetCol)) {
      toast.error('That move is not allowed')
      return
    }

    if (sourceCol === ConversationStatus.QUEUE && targetCol === ConversationStatus.IN_PROGRESS) {
      setPendingAssign(conv)
      return
    }
    if (sourceCol === ConversationStatus.IN_PROGRESS && targetCol === ConversationStatus.CLOSED) {
      setPendingResolve(conv)
      return
    }
  }

  function applyMove(conv: IConversation, sourceCol: ColKey, targetCol: ColKey) {
    const snapshot = { ...board }
    setBoard((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter((c) => c.id !== conv.id),
      [targetCol]: [{ ...conv, status: targetCol }, ...prev[targetCol]],
    }))
    return () => setBoard(snapshot)
  }

  async function handleAssignConfirm() {
    if (!pendingAssign) return
    const conv = pendingAssign
    setPendingAssign(null)
    const revert = applyMove(conv, ConversationStatus.QUEUE, ConversationStatus.IN_PROGRESS)
    onRemoveFromQueue(conv.id)
    try {
      await onAssign(conv.id)
    } catch {
      revert()
      toast.error('Failed to assign conversation')
    }
  }

  async function handleResolveConfirm() {
    if (!pendingResolve) return
    const conv = pendingResolve
    setPendingResolve(null)
    const revert = applyMove(conv, ConversationStatus.IN_PROGRESS, ConversationStatus.CLOSED)
    try {
      await onResolve(conv.id)
    } catch {
      revert()
      toast.error('Failed to resolve conversation')
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
        <div className="flex justify-around gap-6 pb-6 min-h-full">
          {COLUMNS.map(({ id, title, accent }) => {
            const validTargets = draggingConv ? (VALID_TRANSITIONS[draggingConv.status] ?? []) : null
            const isDropDisabled = validTargets != null && !validTargets.includes(id)
            return (
              <ClaimColumn
                key={id}
                id={id}
                title={title}
                accent={accent}
                conversations={isLoading ? [] : board[id]}
                isLoading={isLoading}
                isDropDisabled={isDropDisabled}
                isCardDraggable={isCardDraggable(id, currentUserId)}
                onOpenConversation={onOpenConversation}
              />
            )
          })}
        </div>
      </div>

      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {draggingConv && (
          <div className="w-96 shadow-2xl rotate-1">
            <ClaimCard conv={draggingConv} />
          </div>
        )}
      </DragOverlay>

      {pendingAssign && (
        <ClaimAssignDialog
          conv={pendingAssign}
          isPending={isAssignPending}
          onConfirm={handleAssignConfirm}
          onCancel={() => setPendingAssign(null)}
        />
      )}

      {pendingResolve && (
        <ClaimResolveDialog
          partnerName={pendingResolve.partner.displayName!}
          avatarUrl={pendingResolve.partner.avatarUrl ?? undefined}
          isPending={isResolvePending}
          onConfirm={handleResolveConfirm}
          onCancel={() => setPendingResolve(null)}
        />
      )}
    </DndContext>
  )
}
