import type { Card } from '../types/game'

type DeductionCardProps = {
  card: Card
  isSelected: boolean
  placeholderImage: string
  onToggle: (cardId: string) => void
}

export function DeductionCard({ card, isSelected, placeholderImage, onToggle }: DeductionCardProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={`deduction-card${isSelected ? ' deduction-card--selected' : ''}`}
      type="button"
      onClick={() => onToggle(card.id)}
    >
      <img
        src={card.image}
        alt=""
        onError={(event) => {
          event.currentTarget.src = placeholderImage
        }}
      />
      <span>{card.name}</span>
    </button>
  )
}
