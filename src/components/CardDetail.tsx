import type { Card as CardData, CardDetailLabels } from '../types/game'

type CardDetailProps = {
  card: CardData
  labels: CardDetailLabels
}

export function CardDetail({ card, labels }: CardDetailProps) {
  return (
    <div className="card-detail">
      <div>
        <p className="card-detail__label">{labels.clue}</p>
        <p>{card.clue}</p>
      </div>
      <div>
        <p className="card-detail__label">{labels.textualEvidence}</p>
        <p>{card.textualEvidence}</p>
      </div>
      <div>
        <p className="card-detail__label">{labels.reasoningHint}</p>
        <p>{card.reasoningHint}</p>
      </div>
    </div>
  )
}
