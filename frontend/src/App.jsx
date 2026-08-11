import { useState } from 'react'
import { analyzeCareerDNA } from './api/client'
import AnalysisResult from './components/AnalysisResult'
import ErrorMessage from './components/ErrorMessage'
import Loading from './components/Loading'
import ResumeInput from './components/ResumeInput'

export default function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAnalyze(input) {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await analyzeCareerDNA(input))
    } catch (requestError) {
      setError(requestError?.message || 'Analysis could not be completed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Career DNA home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Career <strong>DNA</strong></span>
        </a>
        <span className="demo-label">MVP Demo</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><span /> Evidence-first intelligence</span>
            <h1>See the signal in<br />your <em>career story.</em></h1>
            <p>AI-powered career intelligence platform that connects resume claims and GitHub evidence into one clear, structured profile.</p>
            <div className="trust-row">
              <span>Deterministic</span><span>No scoring</span><span>Provenance preserved</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="dna-column">
              {[0, 1, 2, 3, 4, 5].map((item) => <div key={item}><i /><span /><i /></div>)}
            </div>
            <span className="floating-label label-resume">Resume evidence</span>
            <span className="floating-label label-github">GitHub signal</span>
          </div>
        </section>

        <section className="workspace">
          <ResumeInput onAnalyze={handleAnalyze} disabled={loading} />
          <aside className="process-card">
            <span className="eyebrow">How it works</span>
            <ol>
              <li><span>1</span><div><strong>Parse</strong><p>Extract canonical skills and structured experience.</p></div></li>
              <li><span>2</span><div><strong>Verify</strong><p>Connect resume claims with repository evidence.</p></div></li>
              <li><span>3</span><div><strong>Compare</strong><p>Map demonstrated skills against role requirements.</p></div></li>
              <li><span>4</span><div><strong>Report</strong><p>Build a transparent, portable Career DNA profile.</p></div></li>
            </ol>
          </aside>
        </section>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
        {loading && <Loading />}
        {result && <AnalysisResult data={result} />}
      </main>

      <footer><span>Career DNA</span><p>Evidence over assumptions. Built for transparent career intelligence.</p></footer>
    </div>
  )
}
