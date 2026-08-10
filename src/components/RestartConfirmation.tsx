import type { ReleaseData } from '../types/game'

type RestartConfirmationProps = {
  content: ReleaseData['restartConfirmation']
  onCancel: () => void
  onConfirm: () => void
}

export function RestartConfirmation({ content, onCancel, onConfirm }: RestartConfirmationProps) {
  return (
    <div className="restart-confirmation" role="presentation">
      <section
        aria-describedby="restart-confirmation-description"
        aria-labelledby="restart-confirmation-title"
        aria-modal="true"
        className="restart-confirmation__dialog"
        role="alertdialog"
      >
        <h2 id="restart-confirmation-title">{content.title}</h2>
        <p id="restart-confirmation-description">{content.description}</p>
        <div className="restart-confirmation__actions">
          <button type="button" onClick={onCancel}>
            {content.cancelButtonLabel}
          </button>
          <button className="restart-confirmation__confirm" type="button" onClick={onConfirm}>
            {content.confirmButtonLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
