export default function Loading() {
  return (
    <section className="loading-panel" aria-live="polite" aria-busy="true">
      <div className="dna-loader" aria-hidden="true"><span /><span /><span /></div>
      <div>
        <span className="eyebrow">Analysis in progress</span>
        <h2>Connecting your evidence</h2>
        <p>Reading skills, matching provenance, and comparing role requirements.</p>
      </div>
    </section>
  )
}
