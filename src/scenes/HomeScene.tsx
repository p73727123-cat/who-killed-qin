import { PrimaryButton } from '../components/PrimaryButton'
import type { HomeUiContent, ReleaseData, ReleasePage } from '../types/game'

type HomeSceneProps = {
  content: HomeUiContent
  release: ReleaseData
  onStart: (sceneId: string) => void
  onOpenRelease: (page: ReleasePage) => void
}

export function HomeScene({ content, release, onStart, onOpenRelease }: HomeSceneProps) {
  return (
    <section className="scene scene--home" aria-labelledby="game-title">
      <div className="title-block">
        <h1 id="game-title">{content.title}</h1>
        <p className="subtitle">{content.subtitle}</p>
        <p className="home-release-version">{release.version}</p>
      </div>
      <PrimaryButton onClick={() => onStart(content.startSceneId)}>
        {content.startButtonLabel}
      </PrimaryButton>
      <div className="home-release-actions">
        <button type="button" onClick={() => onOpenRelease('credits')}>
          {release.actions.creditsButtonLabel}
        </button>
        <button type="button" onClick={() => onOpenRelease('teacher-guide')}>
          {release.actions.teacherGuideButtonLabel}
        </button>
      </div>
    </section>
  )
}
