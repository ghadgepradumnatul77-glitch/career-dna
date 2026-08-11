function displaySkill(skillId) {
  return skillId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function GapCard({ gap }) {
  return (
    <article className="gap-card">
      <div className="gap-icon" aria-hidden="true">↗</div>
      <div className="gap-copy">
        <div className="gap-title-row">
          <h3>{displaySkill(gap.skill_id)}</h3>
          <span className="priority-badge">Not scored</span>
        </div>
        <p>Required by the selected Software Engineer role; no supporting evidence was detected.</p>
      </div>
    </article>
  )
}
