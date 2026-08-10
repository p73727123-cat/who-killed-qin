import type { DeductionQuestion as DeductionQuestionData } from '../types/game'

type DeductionQuestionProps = {
  question: DeductionQuestionData
  selectedOptionIds: string[]
  onChange: (questionId: string, optionId: string, isSelected: boolean) => void
}

export function DeductionQuestion({
  question,
  selectedOptionIds,
  onChange,
}: DeductionQuestionProps) {
  const inputType = question.selectionMode === 'multiple' ? 'checkbox' : 'radio'

  return (
    <fieldset className="deduction-question">
      <legend>{question.prompt}</legend>
      <div className="deduction-question__options">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id)

          return (
            <label className="deduction-option" key={option.id}>
              <input
                checked={isSelected}
                name={question.id}
                type={inputType}
                onChange={() => onChange(question.id, option.id, !isSelected)}
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
