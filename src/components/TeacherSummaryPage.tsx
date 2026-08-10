import type { TeacherData } from '../types/game'

type TeacherSummaryPageProps = {
  content: TeacherData['teacherSummary']
}

export function TeacherSummaryPage({ content }: TeacherSummaryPageProps) {
  return (
    <main className="teacher-results" aria-labelledby="teacher-summary-title">
      <section className="teacher-results__content teacher-summary">
        <header className="teacher-results__header">
          <h1 id="teacher-summary-title">{content.title}</h1>
          <a href="/teacher">{content.backButtonLabel}</a>
        </header>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </main>
  )
}
