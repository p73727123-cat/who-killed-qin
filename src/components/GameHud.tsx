type GameHudProps = {
  gameTitle: string
  chapter: string
  version: string
  completionLabel: string
  completion: number
  completionSuffix: string
  releaseInfoButtonLabel: string
  canOpenDeduction: boolean
  onOpenCards: () => void
  onOpenCharacters: () => void
  onOpenDeduction: () => void
  onOpenRelease: () => void
}

export function GameHud({
  gameTitle,
  chapter,
  version,
  completionLabel,
  completion,
  completionSuffix,
  releaseInfoButtonLabel,
  canOpenDeduction,
  onOpenCards,
  onOpenCharacters,
  onOpenDeduction,
  onOpenRelease,
}: GameHudProps) {
  return (
    <>
      <header className="game-hud">
        <p className="game-hud__title">{gameTitle}</p>
        <p className="game-hud__chapter">{chapter}</p>
        <p className="game-hud__progress">
          {version} ・ {completionLabel} {completion}
          {completionSuffix}
        </p>
      </header>
      <button className="game-hud__release-button" type="button" onClick={onOpenRelease}>
        {releaseInfoButtonLabel}
      </button>
      <nav className="game-hud__navigation" aria-label="遊戲介面">
        <span className="game-hud__item game-hud__item--active">探索</span>
        <button className="game-hud__item game-hud__item--button" type="button" onClick={onOpenCharacters}>
          人物
        </button>
        <button className="game-hud__item game-hud__item--button" type="button" onClick={onOpenCards}>
          卡牌
        </button>
        <button
          className="game-hud__item game-hud__item--button"
          disabled={!canOpenDeduction}
          type="button"
          onClick={onOpenDeduction}
        >
          推理
        </button>
      </nav>
    </>
  )
}
