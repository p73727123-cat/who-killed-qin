import { Card } from './Card'
import type { Card as CardData, CardUiContent } from '../types/game'

type CardGridProps = {
  cards: CardData[]
  unlockedCardIds: string[]
  ui: CardUiContent
}

export function CardGrid({ cards, unlockedCardIds, ui }: CardGridProps) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Card card={card} isUnlocked={unlockedCardIds.includes(card.id)} key={card.id} ui={ui} />
      ))}
    </div>
  )
}
