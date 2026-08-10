import type { GameState, ReleaseMilestone } from '../types/game'

export function getCompletionPercentage(gameState: GameState, milestones: ReleaseMilestone[]) {
  return milestones.reduce((highestPercent, milestone) => {
    const isUnlocked = milestone.requiredUnlockedSceneId
      ? gameState.unlockedScenes.includes(milestone.requiredUnlockedSceneId)
      : true
    const hasEnding = milestone.requiresEnding ? gameState.ending !== null : true

    return isUnlocked && hasEnding ? Math.max(highestPercent, milestone.percent) : highestPercent
  }, 0)
}
