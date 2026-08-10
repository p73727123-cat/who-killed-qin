import { useState, type FormEvent } from 'react'
import type { TeacherData } from '../types/game'

type StudentIdScreenProps = {
  content: TeacherData['studentId']
  onSubmit: (studentId: string) => void
}

export function StudentIdScreen({ content, onSubmit }: StudentIdScreenProps) {
  const [studentId, setStudentId] = useState('')
  const [hasError, setHasError] = useState(false)

  const submitStudentId = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedStudentId = studentId.trim().toUpperCase()

    if (!new RegExp(content.pattern).test(normalizedStudentId)) {
      setHasError(true)
      return
    }

    onSubmit(normalizedStudentId)
  }

  return (
    <section className="student-id-screen" aria-labelledby="student-id-title">
      <form className="student-id-screen__form" noValidate onSubmit={submitStudentId}>
        <h1 id="student-id-title">{content.title}</h1>
        <p>{content.description}</p>
        <label htmlFor="student-id">{content.fieldLabel}</label>
        <input
          aria-describedby={hasError ? 'student-id-error' : undefined}
          aria-invalid={hasError}
          id="student-id"
          inputMode="text"
          maxLength={3}
          pattern={content.pattern}
          placeholder={content.placeholder}
          required
          type="text"
          value={studentId}
          onChange={(event) => {
            setStudentId(event.target.value)
            setHasError(false)
          }}
        />
        {hasError && <p className="student-id-screen__error" id="student-id-error">{content.validationMessage}</p>}
        <button type="submit">{content.submitButtonLabel}</button>
      </form>
    </section>
  )
}
