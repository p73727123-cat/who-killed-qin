import { useState } from 'react'
import { CardDetail } from './CardDetail'
import type { Card as CardData, CardUiContent } from '../types/game'

type CardProps = {
  card: CardData
  isUnlocked: boolean
  ui: CardUiContent
}

export function Card({ card, isUnlocked, ui }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!isUnlocked) {
    return (
      <div className="game-card game-card--locked" aria-label={ui.lockedLabel}>
        <span>{ui.lockedLabel}</span>
      </div>
    )
  }

  return (
    <button
      aria-pressed={isFlipped}
      className="game-card"
      type="button"
      onClick={() => setIsFlipped((currentValue) => !currentValue)}
    >
      {isFlipped ? (
        <CardDetail card={card} labels={ui.detailLabels} />
      ) : (
        <>
          <img
            className="game-card__image"
            src={card.image}
            alt=""
            onError={(event) => {
              event.currentTarget.src = ui.placeholderImage
            }}
          />
          <span className="game-card__name">{card.name}</span>
          <span className="game-card__type">{ui.typeLabels[card.type]}</span>
          <span className="game-card__description">{card.description}</span>
        </>
      )}
    </button>
  )
}
