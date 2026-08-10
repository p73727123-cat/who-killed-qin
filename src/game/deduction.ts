import type { Ending } from '../types/game'

export function calculateEnding(
  endings: Ending[],
  selectedCardIds: string[],
  answers: Record<string, string[]>,
) {
  return [...endings]
    .sort((firstEnding, secondEnding) => secondEnding.priority - firstEnding.priority)
    .find((ending) => matchesEnding(ending, selectedCardIds, answers))
}

function matchesEnding(
  ending: Ending,
  selectedCardIds: string[],
  answers: Record<string, string[]>,
) {
  const hasRequiredCards = ending.requiredCardIds.every((cardId) => selectedCardIds.includes(cardId))
  const hasMinimumCards =
    ending.minSelectedCardCount === undefined || selectedCardIds.length >= ending.minSelectedCardCount
  const hasRequiredAnswers = Object.entries(ending.requiredAnswers).every(
    ([questionId, requiredAnswer]) => {
      const selectedAnswers = answers[questionId] ?? []
      const requiredAnswers = Array.isArray(requiredAnswer) ? requiredAnswer : [requiredAnswer]
      return requiredAnswers.every((answer) => selectedAnswers.includes(answer))
    },
  )

  return hasRequiredCards && hasMinimumCards && hasRequiredAnswers
}
