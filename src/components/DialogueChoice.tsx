import type { DialogueChoice as DialogueChoiceData } from '../types/game'

type DialogueChoiceProps = {
  choice: DialogueChoiceData
  onSelect: (choice: DialogueChoiceData) => void
}

export function DialogueChoice({ choice, onSelect }: DialogueChoiceProps) {
  return (
    <button className="dialogue-choice" type="button" onClick={() => onSelect(choice)}>
      {choice.text}
    </button>
  )
}
