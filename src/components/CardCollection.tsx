import { CardGrid } from './CardGrid'
import type { Card as CardData, CardUiContent } from '../types/game'

type CardCollectionProps = {
  cards: CardData[]
  unlockedCardIds: string[]
  ui: CardUiContent
  title?: string
  description?: string
  onClose: () => void
}

export function CardCollection({ cards, unlockedCardIds, ui, title, description, onClose }: CardCollectionProps) {
  return (
    <section className="card-collection" aria-labelledby="card-collection-title">
      <div className="card-collection__header">
        <div>
          <h1 id="card-collection-title">{title ?? ui.collectionTitle}</h1>
          {description && <p className="card-collection__description">{description}</p>}
        </div>
        <button className="collection-close-button" type="button" onClick={onClose}>
          {ui.closeButtonLabel}
        </button>
      </div>
      <CardGrid cards={cards} unlockedCardIds={unlockedCardIds} ui={ui} />
    </section>
  )
}
