import { DialogueChoice } from './DialogueChoice'
import type { DialogueChoice as DialogueChoiceData } from '../types/game'

type DialogueBoxProps = {
  characterName: string
  text: string
  choices: DialogueChoiceData[]
  onSelectChoice: (choice: DialogueChoiceData) => void
}

export function DialogueBox({
  characterName,
  text,
  choices,
  onSelectChoice,
}: DialogueBoxProps) {
  return (
    <section className="dialogue-box" aria-live="polite">
      <p className="dialogue-speaker">{characterName}</p>
      <p className="dialogue-text">{text}</p>
      <div className="dialogue-choices">
        {choices.map((choice) => (
          <DialogueChoice key={choice.id} choice={choice} onSelect={onSelectChoice} />
        ))}
      </div>
    </section>
  )
}
