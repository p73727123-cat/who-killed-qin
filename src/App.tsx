import { useRef, useState } from 'react'
import { CardCollection } from './components/CardCollection'
import { DeductionBoard } from './components/DeductionBoard'
import { GameHud } from './components/GameHud'
import { ReleasePanel } from './components/ReleasePanel'
import { RestartConfirmation } from './components/RestartConfirmation'
import { SceneNavigation } from './components/SceneNavigation'
import { StudentIdScreen } from './components/StudentIdScreen'
import { TeacherResultsPage } from './components/TeacherResultsPage'
import { TeacherSummaryPage } from './components/TeacherSummaryPage'
import { gameData, getSceneById } from './data'
import { DialogueManager } from './game/DialogueManager'
import {
  getInvestigationRecords,
  getLatestInvestigationRecord,
  saveInvestigationRecord,
} from './game/investigationRecords'
import { getSavedGameState, resetGameState, saveGameState } from './game/progress'
import { getCompletionPercentage } from './game/release'
import { submitInvestigationResult } from './services/googleSheet'
import { HomeScene } from './scenes/HomeScene'
import { SceneView } from './scenes/SceneView'
import type {
  DeductionSubmission,
  DialogueChoice,
  GoogleSheetSubmission,
  InvestigationRecord,
  ReleasePage,
} from './types/game'

function App() {
  if (window.location.pathname === '/teacher') {
    return <TeacherEdition />
  }

  if (window.location.pathname === '/teacher-info') {
    return <TeacherSummaryPage content={gameData.teacher.teacherSummary} />
  }

  return <GameApp />
}

function TeacherEdition() {
  return (
    <TeacherResultsPage
      content={gameData.teacher.teacherPage}
      endings={gameData.endings}
      records={getInvestigationRecords()}
    />
  )
}

function GameApp() {
  const [gameState, setGameState] = useState(getSavedGameState)
  const [isCardCollectionOpen, setIsCardCollectionOpen] = useState(false)
  const [releasePage, setReleasePage] = useState<ReleasePage | null>(null)
  const [isRestartConfirmationOpen, setIsRestartConfirmationOpen] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    () => (gameState.submitted ? 'success' : 'idle'),
  )
  const isSubmittingResult = useRef(gameState.submitted)
  const currentScene = getSceneById(gameState.currentScene)
  const completion = getCompletionPercentage(
    gameState,
    gameData.release.completion.milestones,
  )
  const activeDialogueId = gameState.dialogueState.currentDialogueId
  const activeDialogueHotspot = currentScene?.hotspots.find(
    (hotspot) => hotspot.dialogueId === activeDialogueId,
  )
  const latestInvestigationRecord = getLatestInvestigationRecord(
    gameState.studentId,
    gameState.ending,
  )

  const saveStudentId = (studentId: string) => {
    setGameState((currentGameState) => {
      const nextGameState = { ...currentGameState, studentId }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const goToScene = (sceneId: string) => {
    setGameState((currentGameState) => {
      const canEnterScene =
        currentGameState.unlockedScenes.includes(sceneId) ||
        (currentGameState.currentScene === null && sceneId === gameData.ui.home.startSceneId)

      if (!canEnterScene) {
        return currentGameState
      }

      const nextGameState = {
        ...currentGameState,
        currentScene: sceneId,
        unlockedScenes: addUniqueIds(currentGameState.unlockedScenes, [sceneId]),
      }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const startDialogue = (dialogueId: string) => {
    setGameState((currentGameState) => {
      const nextGameState = {
        ...currentGameState,
        dialogueState: {
          ...currentGameState.dialogueState,
          currentDialogueId: dialogueId,
        },
      }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const applyDialogueChoice = (choice: DialogueChoice, dialogueId: string) => {
    setGameState((currentGameState) => {
      const nextGameState = {
        ...currentGameState,
        dialogueState: {
          currentDialogueId: choice.next,
          completedDialogueIds: addUniqueIds(
            currentGameState.dialogueState.completedDialogueIds,
            [dialogueId],
          ),
        },
        collectedCards: addUniqueIds(
          currentGameState.collectedCards,
          choice.reward?.cardIds ?? [],
        ),
        unlockedScenes: addUniqueIds(
          currentGameState.unlockedScenes,
          choice.unlockScene ? [choice.unlockScene] : [],
        ),
        completedEvents: addUniqueIds(
          currentGameState.completedEvents,
          choice.completedEvent ? [choice.completedEvent] : [],
        ),
      }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const closeDialogue = () => {
    setGameState((currentGameState) => {
      const nextGameState = {
        ...currentGameState,
        dialogueState: {
          ...currentGameState.dialogueState,
          currentDialogueId: null,
        },
      }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const saveEnding = (submission: DeductionSubmission | null) => {
    const ending = submission?.endingId ?? null
    const investigationRecord = createInvestigationRecord(
      gameState.studentId,
      ending,
      submission?.answers ?? {},
    )

    if (investigationRecord) {
      saveInvestigationRecord(investigationRecord)
    }

    setGameState((currentGameState) => {
      const nextGameState = {
        ...currentGameState,
        ending,
        completedEvents: ending
          ? addUniqueIds(currentGameState.completedEvents, [gameData.deduction.ui.completedEventId])
          : currentGameState.completedEvents,
      }
      saveGameState(nextGameState)
      return nextGameState
    })
  }

  const submitResult = async () => {
    if (!latestInvestigationRecord || gameState.submitted || isSubmittingResult.current) {
      return
    }

    isSubmittingResult.current = true
    setSubmissionStatus('submitting')
    const payload: GoogleSheetSubmission = {
      studentId: latestInvestigationRecord.studentId,
      ending: latestInvestigationRecord.ending,
      suspect: latestInvestigationRecord.suspect,
      causes: latestInvestigationRecord.causes.join('、'),
      symbolism: latestInvestigationRecord.symbolism,
      cardCount: gameState.collectedCards.length,
      completionRate: getCompletionPercentage(
        { ...gameState, ending: latestInvestigationRecord.ending },
        gameData.release.completion.milestones,
      ),
      completedAt: latestInvestigationRecord.completedAt,
    }

    try {
      await submitInvestigationResult(payload)
      setGameState((currentGameState) => {
        if (
          currentGameState.studentId !== payload.studentId ||
          currentGameState.ending !== payload.ending
        ) {
          return currentGameState
        }

        const nextGameState = { ...currentGameState, submitted: true }
        saveGameState(nextGameState)
        return nextGameState
      })
      setSubmissionStatus('success')
    } catch {
      isSubmittingResult.current = false
      setSubmissionStatus('error')
    }
  }

  const restartGame = () => {
    setIsCardCollectionOpen(false)
    setReleasePage(null)
    setIsRestartConfirmationOpen(false)
    setSubmissionStatus('idle')
    isSubmittingResult.current = false
    setGameState(resetGameState())
  }

  return (
    <main className="app-shell">
      {!gameState.studentId && !currentScene ? (
        <StudentIdScreen content={gameData.teacher.studentId} onSubmit={saveStudentId} />
      ) : releasePage ? (
        <ReleasePanel
          data={gameData.release}
          page={releasePage}
          onChangePage={setReleasePage}
          onClose={() => setReleasePage(null)}
        />
      ) : currentScene ? (
        isCardCollectionOpen ? (
          <CardCollection
            cards={gameData.cards}
            unlockedCardIds={gameState.collectedCards}
            ui={gameData.cardsUi}
            onClose={() => setIsCardCollectionOpen(false)}
          />
        ) : currentScene.mode === 'deduction' ? (
          <SceneView
            overlay={
              <DeductionBoard
                cards={gameData.cards}
                cardPlaceholderImage={gameData.cardsUi.placeholderImage}
                deduction={gameData.deduction}
                endings={gameData.endings}
                initialEndingId={gameState.ending}
                unlockedCardIds={gameState.collectedCards}
                onResolve={saveEnding}
                teacherResult={
                  latestInvestigationRecord
                    ? {
                        record: latestInvestigationRecord,
                        completion,
                        content: gameData.teacher.result,
                    }
                    : undefined
                }
                submission={
                  latestInvestigationRecord
                    ? {
                        status: submissionStatus,
                        content: gameData.teacher.submission,
                        onSubmit: submitResult,
                      }
                    : undefined
                }
              />
            }
            placeholderImage={gameData.scenesUi.placeholderImage}
            scene={currentScene}
            onStartDialogue={startDialogue}
          />
        ) : activeDialogueId ? (
          <SceneView
            overlay={
              <DialogueManager
                key={activeDialogueId}
                characters={gameData.characters}
                dialogues={gameData.dialogues}
                startDialogueId={activeDialogueId}
                onApplyChoice={applyDialogueChoice}
                onClose={closeDialogue}
              />
            }
            placeholderImage={gameData.scenesUi.placeholderImage}
            portraitImage={activeDialogueHotspot?.portraitImage}
            scene={currentScene}
            onStartDialogue={startDialogue}
          />
        ) : (
          <>
            <SceneView
              placeholderImage={gameData.scenesUi.placeholderImage}
              scene={currentScene}
              onStartDialogue={startDialogue}
            />
            <SceneNavigation
              currentSceneId={currentScene.id}
              label={gameData.ui.exploration.navigationLabel}
              scenes={gameData.scenes}
              unlockedSceneIds={gameState.unlockedScenes}
              onSelectScene={goToScene}
            />
          </>
        )
      ) : (
        <HomeScene
          content={gameData.ui.home}
          release={gameData.release}
          onOpenRelease={setReleasePage}
          onStart={goToScene}
        />
      )}
      {currentScene && !releasePage && (
        <>
          {!isCardCollectionOpen && (
            <GameHud
              chapter={currentScene.name}
              completion={completion}
              completionLabel={gameData.release.completion.label}
              completionSuffix={gameData.release.completion.suffix}
              gameTitle={gameData.ui.home.title}
              releaseInfoButtonLabel={gameData.release.actions.releaseInfoButtonLabel}
              onOpenCards={() => setIsCardCollectionOpen(true)}
              onOpenRelease={() => setReleasePage('credits')}
              version={gameData.release.version}
            />
          )}
          <button
            className="game-restart-button"
            type="button"
            onClick={() => setIsRestartConfirmationOpen(true)}
          >
            {gameData.ui.exploration.restartButtonLabel}
          </button>
        </>
      )}
      {isRestartConfirmationOpen && (
        <RestartConfirmation
          content={gameData.release.restartConfirmation}
          onCancel={() => setIsRestartConfirmationOpen(false)}
          onConfirm={restartGame}
        />
      )}
    </main>
  )
}

function createInvestigationRecord(
  studentId: string | null,
  ending: string | null,
  answers: Record<string, string[]>,
): InvestigationRecord | null {
  if (!studentId || !ending) {
    return null
  }

  return {
    studentId,
    ending,
    suspect: getAnswerLabels(gameData.teacher.recordFields.suspectQuestionId, answers).join('、'),
    causes: getAnswerLabels(gameData.teacher.recordFields.causesQuestionId, answers),
    symbolism: getAnswerLabels(gameData.teacher.recordFields.symbolismQuestionId, answers).join('、'),
    completedAt: new Date().toISOString(),
  }
}

function getAnswerLabels(questionId: string, answers: Record<string, string[]>) {
  const question = gameData.deduction.questions.find((item) => item.id === questionId)
  const selectedOptionIds = answers[questionId] ?? []

  return selectedOptionIds.map(
    (optionId) => question?.options.find((option) => option.id === optionId)?.label ?? optionId,
  )
}

function addUniqueIds(existingIds: string[], newIds: string[]) {
  return [...new Set([...existingIds, ...newIds])]
}

export default App
