import { useState } from 'react'

const EXAMPLE_RESUME = `SKILLS
Python, SQL, FastAPI, Docker

PROJECTS
Career API
- Built a FastAPI service with Docker.

EXPERIENCE
Software Engineer | Example Corp | 2024–2026
Built Python and SQL reporting services.`

export default function ResumeInput({ onAnalyze, disabled }) {
  const [resumeText, setResumeText] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!resumeText.trim()) {
      setValidationError('Add your resume text to begin the analysis.')
      return
    }
    setValidationError('')
    onAnalyze({ resumeText, githubUsername })
  }

  function loadExample() {
    setResumeText(EXAMPLE_RESUME)
    setGithubUsername('career-dna-demo')
    setValidationError('')
  }

  return (
    <form className="input-card" onSubmit={handleSubmit}>
      <div className="section-heading input-heading">
        <div>
          <span className="eyebrow">Evidence in</span>
          <h2>Build your career profile</h2>
        </div>
        <button className="text-button" type="button" onClick={loadExample} disabled={disabled}>
          Use sample
        </button>
      </div>

      <label className="field-label" htmlFor="resume-text">
        Resume text <span>Required</span>
      </label>
      <textarea
        id="resume-text"
        value={resumeText}
        onChange={(event) => setResumeText(event.target.value)}
        placeholder="Paste your resume here. Sections such as Skills, Projects, and Experience produce the clearest evidence."
        rows="13"
        disabled={disabled}
        aria-describedby={validationError ? 'resume-error' : 'resume-hint'}
      />
      {validationError ? (
        <p className="field-error" id="resume-error">{validationError}</p>
      ) : (
        <p className="field-hint" id="resume-hint">Your text is processed for this analysis only.</p>
      )}

      <label className="field-label" htmlFor="github-username">
        GitHub username <span>Optional</span>
      </label>
      <div className="github-field">
        <span aria-hidden="true">github.com/</span>
        <input
          id="github-username"
          value={githubUsername}
          onChange={(event) => setGithubUsername(event.target.value)}
          placeholder="octocat"
          autoComplete="off"
          disabled={disabled}
        />
      </div>

      <button className="primary-button" type="submit" disabled={disabled}>
        <span>{disabled ? 'Analyzing evidence…' : 'Analyze Career DNA'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
