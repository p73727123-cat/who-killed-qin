import type { GameState } from '../types/game'

const PROGRESS_KEY = 'who-killed-qin-de-can:game-state'

export const initialGameState: GameState = {
  studentId: null,
  submitted: false,
  currentScene: null,
  dialogueState: {
    currentDialogueId: null,
    completedDialogueIds: [],
  },
  unlockedScenes: [],
  collectedCards: [],
  completedEvents: [],
  ending: null,
  hintsUsed: [],
  timelineProgress: {},
  learningMetrics: {
    characterUnderstanding: 0,
  },
}

export function getSavedGameState(): GameState {
  const savedState = localStorage.getItem(PROGRESS_KEY)

  if (!savedState) {
    return initialGameState
  }

  try {
    const parsedState = JSON.parse(savedState) as Record<string, unknown>
    const currentScene = asNullableString(parsedState.currentScene ?? parsedState.currentSceneId)
    const dialogueState = asRecord(parsedState.dialogueState)

    return {
      studentId: asNullableString(parsedState.studentId),
      submitted: parsedState.submitted === true,
      currentScene,
      dialogueState: {
        currentDialogueId: asNullableString(dialogueState.currentDialogueId),
        completedDialogueIds: asStringArray(
          dialogueState.completedDialogueIds ?? parsedState.completedDialogueIds,
        ),
      },
      unlockedScenes: addCurrentScene(
        asStringArray(parsedState.unlockedScenes ?? parsedState.unlockedSceneIds),
        currentScene,
      ),
      collectedCards: asStringArray(parsedState.collectedCards ?? parsedState.unlockedCardIds),
      completedEvents: asStringArray(parsedState.completedEvents),
      ending: asNullableString(parsedState.ending ?? parsedState.endingId),
      hintsUsed: asStringArray(parsedState.hintsUsed),
      timelineProgress: asTimelineProgress(parsedState.timelineProgress),
      learningMetrics: {
        characterUnderstanding: asNonNegativeNumber(
          asRecord(parsedState.learningMetrics).characterUnderstanding,
        ),
      },
    }
  } catch {
    return initialGameState
  }
}

export function saveGameState(gameState: GameState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameState))
}

export function resetGameState() {
  localStorage.removeItem(PROGRESS_KEY)
  return initialGameState
}

function asRecord(value: unknown) {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function asNullableString(value: unknown) {
  return typeof value === 'string' ? value : null
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function addCurrentScene(sceneIds: string[], currentScene: string | null) {
  return currentScene && !sceneIds.includes(currentScene) ? [...sceneIds, currentScene] : sceneIds
}

function asTimelineProgress(value: unknown) {
  const progress = asRecord(value)

  return Object.fromEntries(
    Object.entries(progress).map(([puzzleId, puzzleValue]) => {
      const puzzle = asRecord(puzzleValue)
      return [
        puzzleId,
        {
          attempts: asNonNegativeNumber(puzzle.attempts),
          hintLevel: asNonNegativeNumber(puzzle.hintLevel),
          completed: puzzle.completed === true,
        },
      ]
    }),
  )
}

function asNonNegativeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
}
