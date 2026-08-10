import type { Ending } from '../types/game'
import { formatCompletedAt } from '../game/time'
import type { InvestigationRecord, TeacherData } from '../types/game'

type EndingResultProps = {
  ending: Ending
  resetButtonLabel: string
  onReset: () => void
  teacherResult?: {
    record: InvestigationRecord
    collectedCardCount: number
    completion: number
    content: TeacherData['result']
  }
  submission?: {
    status: 'idle' | 'submitting' | 'success' | 'error'
    content: TeacherData['submission']
    onSubmit: () => void
  }
}

export function EndingResult({
  ending,
  resetButtonLabel,
  onReset,
  teacherResult,
  submission,
}: EndingResultProps) {
  return (
    <section className="ending-result">
      <h2>{ending.title}</h2>
      <p>{ending.description}</p>
      {teacherResult && (
        <dl className="ending-result__summary">
          <div>
            <dt>{teacherResult.content.studentIdLabel}</dt>
            <dd>{teacherResult.record.studentId}</dd>
          </div>
          <div>
            <dt>{teacherResult.content.endingLabel}</dt>
            <dd>{ending.title}</dd>
          </div>
          <div>
            <dt>{teacherResult.content.collectedCardsLabel}</dt>
            <dd>{teacherResult.collectedCardCount}</dd>
          </div>
          <div>
            <dt>{teacherResult.content.completionLabel}</dt>
            <dd>{teacherResult.completion}{teacherResult.content.completionSuffix}</dd>
          </div>
          <div>
            <dt>{teacherResult.content.completedAtLabel}</dt>
            <dd>{formatCompletedAt(teacherResult.record.completedAt)}</dd>
          </div>
        </dl>
      )}
      {teacherResult && submission && (
        <div className="ending-result__submission">
          {submission.status === 'success' ? (
            <>
              <p className="ending-result__success">{submission.content.successMessage}</p>
              <p>{submission.content.successThanks}</p>
            </>
          ) : (
            <>
              <button
                disabled={submission.status === 'submitting'}
                type="button"
                onClick={submission.onSubmit}
              >
                {submission.status === 'submitting'
                  ? submission.content.submittingButtonLabel
                  : submission.content.submitButtonLabel}
              </button>
              {submission.status === 'error' && (
                <p className="ending-result__error">{submission.content.errorMessage}</p>
              )}
            </>
          )}
        </div>
      )}
      <button type="button" onClick={onReset}>
        {resetButtonLabel}
      </button>
    </section>
  )
}
