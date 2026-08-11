import cardsJson from './cards.json'
import charactersJson from './characters.json'
import dialoguesJson from './dialogues.json'
import endingsJson from './endings.json'
import scenesJson from './scenes.json'
import releaseJson from './release.json'
import teacherJson from './teacher.json'
import timelinePuzzlesJson from './timelinePuzzles.json'
import type {
  CardsFile,
  CharactersFile,
  DialogueFile,
  EndingsFile,
  ReleaseData,
  ScenesFile,
  TeacherFile,
  TimelinePuzzlesFile,
} from '../types/game'

export const charactersData: CharactersFile = charactersJson
export const dialoguesData: DialogueFile = dialoguesJson
export const cardsData = cardsJson as CardsFile
export const scenesData = scenesJson as ScenesFile
export const endingsData = endingsJson as EndingsFile
export const releaseData = releaseJson as ReleaseData
export const teacherData = teacherJson as TeacherFile
export const timelinePuzzlesData = timelinePuzzlesJson as TimelinePuzzlesFile

export const gameData = {
  characters: charactersData.characters,
  dialogues: dialoguesData.dialogues,
  cards: cardsData.cards,
  scenes: scenesData.scenes,
  endings: endingsData.endings,
  deduction: endingsData.deduction,
  ui: dialoguesData.ui,
  cardsUi: cardsData.ui,
  scenesUi: scenesData.ui,
  release: releaseData,
  teacher: teacherData.teacher,
  timelinePuzzles: timelinePuzzlesData.timelinePuzzles,
  timelineEvents: timelinePuzzlesData.events,
}

export function getSceneById(sceneId: string | null) {
  return gameData.scenes.find((scene) => scene.id === sceneId)
}
