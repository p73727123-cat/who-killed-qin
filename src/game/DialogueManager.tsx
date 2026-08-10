import { useState } from 'react'
import { DialogueBox } from '../components/DialogueBox'
import type { Character, Dialogue, DialogueChoice } from '../types/game'

type DialogueManagerProps = {
  startDialogueId: string
  dialogues: Dialogue[]
  characters: Character[]
  onApplyChoice: (choice: DialogueChoice, dialogueId: string) => void
  onClose: () => void
}

export function DialogueManager({
  startDialogueId,
  dialogues,
  characters,
  onApplyChoice,
  onClose,
}: DialogueManagerProps) {
  const [currentDialogueId, setCurrentDialogueId] = useState(startDialogueId)
  const currentDialogue = dialogues.find((dialogue) => dialogue.id === currentDialogueId)

  if (!currentDialogue) {
    return null
  }

  const character = characters.find((item) => item.id === currentDialogue.characterId)

  const handleChoice = (choice: DialogueChoice) => {
    onApplyChoice(choice, currentDialogue.id)

    if (choice.next === null) {
      onClose()
      return
    }

    setCurrentDialogueId(choice.next)
  }

  return (
    <DialogueBox
      characterName={character?.name ?? ''}
      text={currentDialogue.text}
      choices={currentDialogue.choices}
      onSelectChoice={handleChoice}
    />
  )
}
