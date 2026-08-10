import type { GoogleSheetSubmission } from '../types/game'

const DEFAULT_API_URL = 'https://script.google.com/macros/s/你的網址/exec'

export async function submitInvestigationResult(result: GoogleSheetSubmission) {
  const apiUrl = import.meta.env.VITE_GOOGLE_SHEETS_API_URL ?? DEFAULT_API_URL

  if (apiUrl === DEFAULT_API_URL) {
    throw new Error('Google Apps Script API URL is not configured.')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  })

  if (!response.ok) {
    throw new Error(`Google Sheets submission failed: ${response.status}`)
  }
}
