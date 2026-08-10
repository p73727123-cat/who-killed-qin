import type { Ending, InvestigationRecord, TeacherData } from '../types/game'
import { formatCompletedAt } from '../game/time'

type TeacherResultsPageProps = {
  content: TeacherData['teacherPage']
  endings: Ending[]
  records: InvestigationRecord[]
}

export function TeacherResultsPage({ content, endings, records }: TeacherResultsPageProps) {
  const exportCsv = () => {
    const rows = [
      ['studentId', 'ending', 'suspect', 'causes', 'symbolism', 'completedAt'],
      ...records.map((record) => [
        record.studentId,
        getEndingTitle(record.ending, endings),
        record.suspect,
        record.causes.join('、'),
        record.symbolism,
        record.completedAt,
      ]),
    ]
    const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'investigation-records.csv'
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <main className="teacher-results" aria-labelledby="teacher-results-title">
      <section className="teacher-results__content">
        <header className="teacher-results__header">
          <div>
            <h1 id="teacher-results-title">{content.title}</h1>
            <p>{content.description}</p>
          </div>
          <div className="teacher-results__links">
            <a href="/teacher-info">{content.teacherInfoButtonLabel}</a>
            <a href="/">{content.backButtonLabel}</a>
          </div>
        </header>
        {records.length === 0 ? (
          <p className="teacher-results__empty">{content.emptyState}</p>
        ) : (
          <>
            <button className="teacher-results__export" type="button" onClick={exportCsv}>
              {content.exportButtonLabel}
            </button>
            <div className="teacher-results__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{content.table.studentId}</th>
                    <th scope="col">{content.table.ending}</th>
                    <th scope="col">{content.table.completedAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={`${record.studentId}-${record.completedAt}`}>
                      <td>{record.studentId}</td>
                      <td>{getEndingTitle(record.ending, endings)}</td>
                      <td>{formatCompletedAt(record.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function getEndingTitle(endingId: string, endings: Ending[]) {
  return endings.find((ending) => ending.id === endingId)?.title ?? endingId
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}
