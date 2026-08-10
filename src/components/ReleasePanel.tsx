import type { ReleaseData, ReleasePage } from '../types/game'

type ReleasePanelProps = {
  data: ReleaseData
  page: ReleasePage
  onChangePage: (page: ReleasePage) => void
  onClose: () => void
}

export function ReleasePanel({ data, page, onChangePage, onClose }: ReleasePanelProps) {
  const section = page === 'credits' ? data.credits : data.teacherGuide

  return (
    <section className="release-panel" aria-labelledby="release-panel-title">
      <header className="release-panel__header">
        <p>{data.version}</p>
        <button type="button" onClick={onClose}>
          {data.actions.backButtonLabel}
        </button>
      </header>
      <nav className="release-panel__tabs" aria-label={data.actions.releaseInfoButtonLabel}>
        <button
          className={page === 'credits' ? 'is-active' : ''}
          type="button"
          onClick={() => onChangePage('credits')}
        >
          {data.actions.creditsButtonLabel}
        </button>
        <button
          className={page === 'teacher-guide' ? 'is-active' : ''}
          type="button"
          onClick={() => onChangePage('teacher-guide')}
        >
          {data.actions.teacherGuideButtonLabel}
        </button>
      </nav>
      <article className="release-panel__content">
        <h1 id="release-panel-title">{section.title}</h1>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </section>
  )
}
