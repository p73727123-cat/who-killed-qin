import { useState } from 'react'
import { calculateEnding } from '../game/deduction'
import { DeductionCard } from './DeductionCard'
import { DeductionQuestion } from './DeductionQuestion'
import { EndingResult } from './EndingResult'
import type {
  Card,
  DeductionData,
  DeductionSubmission,
  Ending,
  InvestigationRecord,
  TeacherData,
} from '../types/game'

type DeductionBoardProps = {
  cards: Card[]
  unlockedCardIds: string[]
  deduction: DeductionData
  endings: Ending[]
  initialEndingId: string | null
  cardPlaceholderImage: string
  onResolve: (submission: DeductionSubmission | null) => void
  teacherResult?: {
    record: InvestigationRecord
    completion: number
    content: TeacherData['result']
  }
  submission?: {
    status: 'idle' | 'submitting' | 'success' | 'error'
    content: TeacherData['submission']
    onSubmit: () => void
  }
}

export function DeductionBoard({
  cards,
  unlockedCardIds,
  deduction,
  endings,
  initialEndingId,
  cardPlaceholderImage,
  onResolve,
  teacherResult,
  submission,
}: DeductionBoardProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [resultId, setResultId] = useState<string | null>(initialEndingId)
  const unlockedCards = cards.filter((card) => unlockedCardIds.includes(card.id))
  const result = endings.find((ending) => ending.id === resultId)

  const toggleCard = (cardId: string) => {
    setSelectedCardIds((currentCardIds) =>
      currentCardIds.includes(cardId)
        ? currentCardIds.filter((currentCardId) => currentCardId !== cardId)
        : [...currentCardIds, cardId],
    )
  }

  const updateAnswer = (questionId: string, optionId: string, isSelected: boolean) => {
    const question = deduction.questions.find((item) => item.id === questionId)

    if (!question) {
      return
    }

    setAnswers((currentAnswers) => {
      const currentOptionIds = currentAnswers[questionId] ?? []
      const nextOptionIds =
        question.selectionMode === 'single'
          ? [optionId]
          : isSelected
            ? [...currentOptionIds, optionId]
            : currentOptionIds.filter((currentOptionId) => currentOptionId !== optionId)

      return { ...currentAnswers, [questionId]: nextOptionIds }
    })
  }

  const submitDeduction = () => {
    const ending = calculateEnding(endings, selectedCardIds, answers)
    setResultId(ending?.id ?? null)
    onResolve({ endingId: ending?.id ?? null, answers })
  }

  const resetDeduction = () => {
    setSelectedCardIds([])
    setAnswers({})
    setResultId(null)
    onResolve(null)
  }

  if (result) {
    return (
      <EndingResult
        ending={result}
        resetButtonLabel={deduction.ui.resetButtonLabel}
        teacherResult={
          teacherResult
            ? {
                ...teacherResult,
                collectedCardCount: unlockedCardIds.length,
              }
            : undefined
        }
        submission={submission}
        onReset={resetDeduction}
      />
    )
  }

  return (
    <section className="deduction-board" aria-labelledby="deduction-title">
      <h1 id="deduction-title">{deduction.ui.title}</h1>
      <h2>{deduction.ui.evidenceTitle}</h2>
      <div className="deduction-card-grid">
        {unlockedCards.map((card) => (
          <DeductionCard
            card={card}
            isSelected={selectedCardIds.includes(card.id)}
            key={card.id}
            placeholderImage={cardPlaceholderImage}
            onToggle={toggleCard}
          />
        ))}
      </div>
      <div className="deduction-questions">
        {deduction.questions.map((question) => (
          <DeductionQuestion
            question={question}
            selectedOptionIds={answers[question.id] ?? []}
            key={question.id}
            onChange={updateAnswer}
          />
        ))}
      </div>
      <button className="deduction-submit" type="button" onClick={submitDeduction}>
        {deduction.ui.submitButtonLabel}
      </button>
    </section>
  )
}
