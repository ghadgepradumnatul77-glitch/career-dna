const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export class CareerDNAApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CareerDNAApiError'
  }
}

export async function analyzeCareerDNA(data) {
  let response

  try {
    response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: data.resumeText,
        github_username: data.githubUsername?.trim() || null,
      }),
    })
  } catch {
    throw new CareerDNAApiError('Career DNA could not reach the analysis service.')
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new CareerDNAApiError('The analysis service returned an invalid response.')
  }

  if (!response.ok || !payload.success) {
    const safeMessage = payload?.error?.message
    throw new CareerDNAApiError(
      typeof safeMessage === 'string' ? safeMessage : 'Analysis could not be completed.',
    )
  }

  return payload.data
}
