export interface Character {
  id: string
  name: string
  description: string
  portraitImage?: string
}

export interface DialogueChoice {
  id: string
  text: string
  next: string | null
  reward?: DialogueReward
  unlockScene?: string
  completedEvent?: string
  requiredEvidenceIds?: string[]
}

export interface DialogueReward {
  cardIds?: string[]
  evidenceIds?: string[]
}

export interface Dialogue {
  id: string
  characterId: string
  sceneId: string
  text: string
  choices: DialogueChoice[]
  isEntryPoint?: boolean
}

export type CardType = 'character' | 'item' | 'event' | 'evidence' | 'theme'

export interface Card {
  id: string
  name: string
  type: CardType
  image: string
  description: string
  clue: string
  textualEvidence: string
  reasoningHint: string
  relatedCharacterIds: string[]
}

export interface CardDetailLabels {
  clue: string
  textualEvidence: string
  reasoningHint: string
}

export interface CardUiContent {
  collectionButtonLabel: string
  collectionTitle: string
  closeButtonLabel: string
  lockedLabel: string
  placeholderImage: string
  typeLabels: Record<CardType, string>
  detailLabels: CardDetailLabels
}

export interface Scene {
  id: string
  name: string
  description: string
  backgroundImage: string
  backgroundAlt: string
  characterIds: string[]
  cardIds: string[]
  evidenceIds: string[]
  hotspots: SceneHotspot[]
  mode?: 'exploration' | 'deduction'
}

export interface SceneHotspot {
  id: string
  type: 'character' | 'object'
  label: string
  position: {
    x: number
    y: number
  }
  dialogueId?: string
  portraitImage?: string
  image?: string
  interactionText?: string
}

export interface ScenesUiContent {
  placeholderImage: string
}

export interface Evidence {
  id: string
  name: string
  description: string
  sourceSceneId: string
  relatedCardIds: string[]
}

export interface Ending {
  id: string
  title: string
  description: string
  priority: number
  requiredCardIds: string[]
  requiredAnswers: Record<string, string | string[]>
  minSelectedCardCount?: number
}

export interface DeductionOption {
  id: string
  label: string
}

export interface DeductionQuestion {
  id: string
  prompt: string
  selectionMode: 'single' | 'multiple'
  options: DeductionOption[]
}

export interface DeductionUiContent {
  title: string
  evidenceTitle: string
  submitButtonLabel: string
  resetButtonLabel: string
  completedEventId: string
}

export interface DeductionData {
  ui: DeductionUiContent
  questions: DeductionQuestion[]
}

export interface GameState {
  studentId: string | null
  submitted: boolean
  currentScene: string | null
  dialogueState: {
    currentDialogueId: string | null
    completedDialogueIds: string[]
  }
  unlockedScenes: string[]
  collectedCards: string[]
  completedEvents: string[]
  ending: string | null
  hintsUsed: string[]
}

export interface InvestigationRecord {
  studentId: string
  ending: string
  suspect: string
  causes: string[]
  symbolism: string
  completedAt: string
}

export interface GoogleSheetSubmission {
  studentId: string
  ending: string
  suspect: string
  causes: string
  symbolism: string
  cardCount: number
  completionRate: number
  completedAt: string
}

export interface DeductionSubmission {
  endingId: string | null
  answers: Record<string, string[]>
}

export interface TeacherData {
  studentId: {
    title: string
    description: string
    fieldLabel: string
    placeholder: string
    pattern: string
    validationMessage: string
    submitButtonLabel: string
  }
  result: {
    studentIdLabel: string
    endingLabel: string
    collectedCardsLabel: string
    completionLabel: string
    completionSuffix: string
    completedAtLabel: string
  }
  teacherPage: {
    title: string
    description: string
    emptyState: string
    exportButtonLabel: string
    backButtonLabel: string
    teacherInfoButtonLabel: string
    table: {
      studentId: string
      ending: string
      completedAt: string
    }
  }
  submission: {
    submitButtonLabel: string
    submittingButtonLabel: string
    successMessage: string
    successThanks: string
    errorMessage: string
  }
  teacherSummary: {
    title: string
    paragraphs: string[]
    backButtonLabel: string
  }
  recordFields: {
    suspectQuestionId: string
    causesQuestionId: string
    symbolismQuestionId: string
  }
}

export interface HomeUiContent {
  title: string
  subtitle: string
  startButtonLabel: string
  startSceneId: string
}

export interface SceneUiContent {
  locationLabel: string
}

export interface ExplorationUiContent {
  talkButtonLabel: string
  navigationLabel: string
  restartButtonLabel: string
}

export type ReleasePage = 'credits' | 'teacher-guide'

export interface ReleaseMilestone {
  id: string
  percent: number
  requiredUnlockedSceneId?: string
  requiresEnding?: boolean
}

export interface ReleaseSection {
  title: string
  paragraphs: string[]
}

export interface ReleaseData {
  version: string
  completion: {
    label: string
    suffix: string
    milestones: ReleaseMilestone[]
  }
  actions: {
    releaseInfoButtonLabel: string
    creditsButtonLabel: string
    teacherGuideButtonLabel: string
    backButtonLabel: string
  }
  credits: ReleaseSection
  teacherGuide: ReleaseSection
  restartConfirmation: {
    title: string
    description: string
    cancelButtonLabel: string
    confirmButtonLabel: string
  }
}

export interface DialogueFile {
  ui: {
    home: HomeUiContent
    scene: SceneUiContent
    exploration: ExplorationUiContent
  }
  dialogues: Dialogue[]
}

export interface CharactersFile {
  characters: Character[]
}

export interface CardsFile {
  ui: CardUiContent
  cards: Card[]
}

export interface ScenesFile {
  ui: ScenesUiContent
  scenes: Scene[]
}

export interface EndingsFile {
  deduction: DeductionData
  endings: Ending[]
}

export interface TeacherFile {
  teacher: TeacherData
}
