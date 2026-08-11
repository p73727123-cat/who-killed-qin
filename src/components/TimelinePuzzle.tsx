import { useMemo, useState, type PointerEvent } from 'react'
import type { TimelineEvent, TimelinePuzzle as TimelinePuzzleData, TimelinePuzzleState } from '../types/game'

type TimelinePuzzleProps = {
  puzzle: TimelinePuzzleData
  events: TimelineEvent[]
  progress: TimelinePuzzleState
  onProgressChange: (progress: TimelinePuzzleState, usedHint: boolean) => void
  onContinue: () => void
}

export function TimelinePuzzle({
  puzzle,
  events,
  progress,
  onProgressChange,
  onContinue,
}: TimelinePuzzleProps) {
  const [orderedEventIds, setOrderedEventIds] = useState(puzzle.initialOrder)
  const [feedback, setFeedback] = useState('')
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null)
  const eventById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events])

  const moveEvent = (eventId: string, targetEventId: string) => {
    if (eventId === targetEventId) {
      return
    }

    setOrderedEventIds((currentOrder) => {
      const nextOrder = currentOrder.filter((id) => id !== eventId)
      const targetIndex = nextOrder.indexOf(targetEventId)
      nextOrder.splice(targetIndex, 0, eventId)
      return nextOrder
    })
  }

  const moveByOffset = (eventId: string, offset: number) => {
    setOrderedEventIds((currentOrder) => {
      const currentIndex = currentOrder.indexOf(eventId)
      const nextIndex = currentIndex + offset

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentOrder.length) {
        return currentOrder
      }

      const nextOrder = [...currentOrder]
      ;[nextOrder[currentIndex], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[currentIndex]]
      return nextOrder
    })
  }

  const submitOrder = () => {
    const isCorrect = orderedEventIds.every((eventId, index) => eventId === puzzle.correctOrder[index])

    if (isCorrect) {
      const nextProgress = { ...progress, completed: true }
      onProgressChange(nextProgress, false)
      setFeedback(puzzle.successMessage)
      return
    }

    const nextAttempts = progress.attempts + 1
    const nextProgress = { ...progress, attempts: nextAttempts }
    onProgressChange(nextProgress, false)
    setFeedback(puzzle.hintMessages[Math.min(nextAttempts - 1, puzzle.hintMessages.length - 1)])
  }

  const resetOrder = () => {
    setOrderedEventIds(puzzle.initialOrder)
    setFeedback('')
  }

  const revealHint = () => {
    const nextHintLevel = Math.min(progress.hintLevel + 1, puzzle.hintMessages.length)
    onProgressChange({ ...progress, hintLevel: nextHintLevel }, true)
    setFeedback(puzzle.hintMessages[nextHintLevel - 1])
  }

  const handlePointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (!draggingEventId || event.pointerType === 'mouse') {
      return
    }

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>(
      '[data-timeline-event-id]',
    )
    const targetEventId = target?.dataset.timelineEventId

    if (targetEventId) {
      moveEvent(draggingEventId, targetEventId)
    }
  }

  return (
    <section className="timeline-puzzle" aria-labelledby="timeline-puzzle-title">
      <p className="timeline-puzzle__chapter">第三章・事件時間線</p>
      <h1 id="timeline-puzzle-title">{puzzle.title}</h1>
      <p className="timeline-puzzle__instruction">{puzzle.instruction}</p>
      <p className="timeline-puzzle__assistive-text">
        可拖曳卡片排序；也可用每張卡片的上下按鈕調整位置。
      </p>

      <ol className="timeline-puzzle__list" aria-label="事件時間線">
        {orderedEventIds.map((eventId, index) => {
          const event = eventById.get(eventId)

          if (!event) {
            return null
          }

          return (
            <li
              className={draggingEventId === eventId ? 'timeline-event is-dragging' : 'timeline-event'}
              data-timeline-event-id={event.id}
              draggable
              key={event.id}
              onDragEnd={() => setDraggingEventId(null)}
              onDragOver={(dragEvent) => dragEvent.preventDefault()}
              onDragStart={() => setDraggingEventId(event.id)}
              onDrop={() => {
                if (draggingEventId) {
                  moveEvent(draggingEventId, event.id)
                }
                setDraggingEventId(null)
              }}
              onPointerDown={(pointerEvent) => {
                if (pointerEvent.pointerType !== 'mouse') {
                  pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)
                  setDraggingEventId(event.id)
                }
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={() => setDraggingEventId(null)}
            >
              <span className="timeline-event__order" aria-label={`第 ${index + 1} 個事件`}>
                {index + 1}
              </span>
              <span className="timeline-event__content">
                <strong>{event.title}</strong>
                <span>{event.description}</span>
              </span>
              <span className="timeline-event__controls" aria-label={`${event.title}的排序控制`}>
                <button
                  aria-label={`將「${event.title}」上移`}
                  disabled={index === 0}
                  type="button"
                  onClick={() => moveByOffset(event.id, -1)}
                >
                  ↑
                </button>
                <button
                  aria-label={`將「${event.title}」下移`}
                  disabled={index === orderedEventIds.length - 1}
                  type="button"
                  onClick={() => moveByOffset(event.id, 1)}
                >
                  ↓
                </button>
              </span>
              <span aria-hidden="true" className="timeline-event__handle">⠿</span>
            </li>
          )
        })}
      </ol>

      {feedback && <p className={progress.completed ? 'timeline-puzzle__success' : 'timeline-puzzle__feedback'}>{feedback}</p>}

      {progress.completed && <p className="timeline-puzzle__reflection">{puzzle.reflectionQuestion}</p>}

      <div className="timeline-puzzle__actions">
        {progress.completed ? (
          <button className="timeline-puzzle__primary" type="button" onClick={onContinue}>
            {puzzle.continueButtonLabel}
          </button>
        ) : (
          <>
            <button className="timeline-puzzle__primary" type="button" onClick={submitOrder}>
              {puzzle.completeButtonLabel}
            </button>
            <button type="button" onClick={resetOrder}>{puzzle.resetButtonLabel}</button>
            <button type="button" onClick={revealHint}>{puzzle.hintButtonLabel}</button>
          </>
        )}
      </div>
    </section>
  )
}
